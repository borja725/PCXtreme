<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class CartController extends AbstractController
{
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
        $qty = max(1, (int)$data['qty']);
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
            $cartItem->setQty($cartItem->getQty() + $qty);
        } else {
            $cartItem = new \App\Entity\CartItem();
            $cartItem->setCart($cart);
            $cartItem->setProducto($producto);
            $cartItem->setQty($qty);
            $em->persist($cartItem);
        }
        $em->flush();

        return new JsonResponse(['success' => true, 'message' => 'Producto añadido al carrito.']);
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
}

