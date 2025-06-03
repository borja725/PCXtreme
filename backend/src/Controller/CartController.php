<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

use App\Service\SupabaseClient;

class CartController extends AbstractController
{
    private $supabase;

    public function __construct(SupabaseClient $supabase)
    {
        $this->supabase = $supabase;
    }
    #[Route('/api/cart/add', name: 'api_cart_add', methods: ['POST'])]
    public function addToCart(Request $request, \Doctrine\ORM\EntityManagerInterface $em, \App\Repository\ProductoRepository $productoRepo): JsonResponse
    {
        $session = $request->getSession();
        $sessionId = $session->getId();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['productId']) || !isset($data['qty'])) {
            return new JsonResponse(['error' => 'Datos incompletos.'], Response::HTTP_BAD_REQUEST);
        }

        $productId = $data['productId'];
        $qty = (int)$data['qty'];
        $producto = $productoRepo->find($productId);
        if (!$producto) {
            return new JsonResponse(['error' => 'Producto no encontrado.'], Response::HTTP_NOT_FOUND);
        }

        $cartRepo = $em->getRepository(\App\Entity\Cart::class);
        $cart = $cartRepo->findOneBy(['sessionId' => $sessionId]);
        if (!$cart) {
            $cart = new \App\Entity\Cart();
            $cart->setSessionId($sessionId);
            $em->persist($cart);
        }

        $cartItemRepo = $em->getRepository(\App\Entity\CartItem::class);
        $cartItem = $cartItemRepo->findOneBy(['cart' => $cart, 'producto' => $producto]);
        if ($cartItem) {
            if ($qty <= 0) {
                $em->remove($cartItem);
            } else {
                $cartItem->setQty($qty);
            }
        } else {
            if ($qty > 0) {
                $cartItem = new \App\Entity\CartItem();
                $cartItem->setCart($cart);
                $cartItem->setProducto($producto);
                $cartItem->setQty($qty);
                $em->persist($cartItem);
            }
        }
        $em->flush();

        $items = [];
        $total = 0;
        foreach ($cart->getItems() as $item) {
            $prod = $item->getProducto();
            $qty = $item->getQty();
            $itemTotal = $prod->getPrecio() * $qty;
            $total += $itemTotal;
            $items[] = [
                'product' => [
                    'id' => $prod->getId(),
                    'name' => $prod->getNombre(),
                    'price' => $prod->getPrecio(),
                    'image' => $prod->getImatgeurl(),
                    'stock' => $prod->getStock(),
                    'category' => $prod->getCategoria(),
                    'subcategory' => $prod->getSubcategoria(),
                ],
                'qty' => $qty,
                'total' => $itemTotal
            ];
        }
        return new JsonResponse([
            'items' => $items,
            'total' => round($total, 2)
        ]);
    }

    #[Route('/api/cart', name: 'api_cart_view', methods: ['GET'])]
    public function viewCart(Request $request, \App\Repository\ProductoRepository $productoRepo, \Doctrine\ORM\EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        $sessionId = $session->getId();
        $cartRepo = $em->getRepository(\App\Entity\Cart::class);
        $cart = $cartRepo->findOneBy(['sessionId' => $sessionId]);
        $items = [];
        $total = 0;
        if ($cart) {
            foreach ($cart->getItems() as $cartItem) {
                $producto = $cartItem->getProducto();
                $qty = $cartItem->getQty();
                $itemTotal = $producto->getPrecio() * $qty;
                $total += $itemTotal;
                $items[] = [
                    'product' => [
                        'id' => $producto->getId(),
                        'name' => $producto->getNombre(),
                        'price' => $producto->getPrecio(),
                        'image' => $producto->getImatgeurl(),
                        'stock' => $producto->getStock(),
                        'category' => $producto->getCategoria(),
                        'subcategory' => $producto->getSubcategoria(),
                    ],
                    'qty' => $qty,
                    'total' => $itemTotal
                ];
            }
        }
        return new JsonResponse([
            'items' => $items,
            'total' => round($total, 2)
        ]);
    }

    #[Route('/api/cart/remove', name: 'api_cart_remove', methods: ['POST'])]
    public function removeFromCart(Request $request, \Doctrine\ORM\EntityManagerInterface $em, \App\Repository\ProductoRepository $productoRepo): JsonResponse
    {
        $session = $request->getSession();
        $sessionId = $session->getId();
        $data = json_decode($request->getContent(), true);
        if (!isset($data['productId'])) {
            return new JsonResponse(['error' => 'Datos incompletos.'], Response::HTTP_BAD_REQUEST);
        }
        $productId = $data['productId'];
        $cartRepo = $em->getRepository(\App\Entity\Cart::class);
        $cart = $cartRepo->findOneBy(['sessionId' => $sessionId]);
        if ($cart) {
            $cartItemRepo = $em->getRepository(\App\Entity\CartItem::class);
            $producto = $productoRepo->find($productId);
            if ($producto) {
                $cartItem = $cartItemRepo->findOneBy(['cart' => $cart, 'producto' => $producto]);
                if ($cartItem) {
                    $em->remove($cartItem);
                    $em->flush();
                }
            }
        }
        $items = [];
        $total = 0;
        if ($cart) {
            foreach ($cart->getItems() as $item) {
                $prod = $item->getProducto();
                $qty = $item->getQty();
                $itemTotal = $prod->getPrecio() * $qty;
                $total += $itemTotal;
                $items[] = [
                    'product' => [
                        'id' => $prod->getId(),
                        'name' => $prod->getNombre(),
                        'price' => $prod->getPrecio(),
                        'image' => $prod->getImatgeurl(),
                        'stock' => $prod->getStock(),
                        'category' => $prod->getCategoria(),
'subcategory' => $prod->getSubcategoria(),
                    ],
                    'qty' => $qty,
                    'total' => $itemTotal
                ];
            }
        }
        return new JsonResponse([
            'items' => $items,
            'total' => round($total, 2)
        ]);
    }

    #[Route('/api/cart/clear', name: 'api_cart_clear', methods: ['POST'])]
    public function clearCart(Request $request, \Doctrine\ORM\EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        $sessionId = $session->getId();
        $cartRepo = $em->getRepository(\App\Entity\Cart::class);
        $cart = $cartRepo->findOneBy(['sessionId' => $sessionId]);
        if ($cart) {
            foreach ($cart->getItems() as $cartItem) {
                $em->remove($cartItem);
            }
            $em->flush();
        }
        return new JsonResponse([
            'items' => [],
            'total' => 0.0
        ]);
    }
}

