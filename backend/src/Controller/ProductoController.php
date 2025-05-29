<?php

namespace App\Controller;

use App\Entity\Producto;
use App\Repository\ProductoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/productos')]
class ProductoController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(Request $request, ProductoRepository $repo, SerializerInterface $serializer): JsonResponse
    {
        $categoria = $request->query->get('categoria');
        $subcategoria = $request->query->get('subcategoria');
        if ($categoria) {
            $productos = $repo->findBy(['categoria' => $categoria]);
        } else {
            $productos = $repo->findAll();
        }
        if ($subcategoria) {
            $productos = $repo->findBy(['subcategoria' => $subcategoria]);
        }

        $productosConResenas = [];
        foreach ($productos as $producto) {
            $reviews = $producto->getReviews();
            $reviewsArray = is_array($reviews) ? $reviews : $reviews->toArray();
            $numResenas = count($reviewsArray);
            $media = $numResenas > 0 ? array_sum(array_map(fn($r) => $r->getRating(), $reviewsArray)) / $numResenas : 0;
            $productoArr = [
                'id' => $producto->getId(),
                'nombre' => $producto->getNombre(),
                'precio' => $producto->getPrecio(),
                'precioAnterior' => null,
                'stock' => $producto->getStock(),
                'descripcion' => $producto->getDescripcion(), // <-- Añade esta línea
                'imatgeurl' => $producto->getImatgeurl(),
                'categoria' => $producto->getCategoria(),
                'subcategoria' => $producto->getSubcategoria(),
                'marca' => $producto->getMarca(),
                'modelo' => $producto->getModelo(),
                'mediaResenas' => round($media,1),
                'numResenas' => $numResenas
            ];
            $productosConResenas[] = $productoArr;
        }
        return $this->json($productosConResenas);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        // Comprobar token y rol admin
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(.*)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }
        $jwt = $matches[1];
        try {
            $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Token inválido'], 401);
        }
        if (!in_array('ROLE_ADMIN', $decoded->roles ?? [])) {
            return new JsonResponse(['error' => 'Solo admin puede crear productos'], 403);
        }
        $data = json_decode($request->getContent(), true);
        $producto = new Producto();
        $producto->setNombre($data['nombre']);
        $producto->setPrecio($data['precio']);
        $producto->setStock($data['stock']);
        $producto->setDescripcion($data['descripcion']);
        $producto->setImatgeurl($data['imatgeurl']);
        $producto->setCategoria($data['categoria']);
        if (isset($data['subcategoria'])) {
            $producto->setSubcategoria($data['subcategoria']);
        }
        if (isset($data['marca'])) {
            $producto->setMarca($data['marca']);
        }
        if (isset($data['modelo'])) {
            $producto->setModelo($data['modelo']);
        }
        $em->persist($producto);
        $em->flush();
        return $this->json(['mensaje' => 'Producto creado'], 201);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Producto $producto, SerializerInterface $serializer): JsonResponse
    {
        $json = $serializer->serialize($producto, 'json', ['groups' => 'producto:read']);
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Producto $producto, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Comprobar token y rol admin
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(.*)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }
        $jwt = $matches[1];
        try {
            $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Token inválido'], 401);
        }
        if (!in_array('ROLE_ADMIN', $decoded->roles ?? [])) {
            return new JsonResponse(['error' => 'Solo admin puede eliminar productos'], 403);
        }
        $em->remove($producto);
        $em->flush();
        return $this->json(['mensaje' => 'Producto eliminado']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Producto $producto, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Comprobar token y rol admin
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(.*)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }
        $jwt = $matches[1];
        try {
            $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Token inválido'], 401);
        }
        if (!in_array('ROLE_ADMIN', $decoded->roles ?? [])) {
            return new JsonResponse(['error' => 'Solo admin puede editar productos'], 403);
        }
        $data = json_decode($request->getContent(), true);
        if (isset($data['nombre'])) $producto->setNombre($data['nombre']);
        if (isset($data['precio'])) $producto->setPrecio($data['precio']);
        if (isset($data['stock'])) $producto->setStock($data['stock']);
        if (isset($data['descripcion'])) $producto->setDescripcion($data['descripcion']);
        if (isset($data['imatgeurl'])) $producto->setImatgeurl($data['imatgeurl']);
        if (isset($data['categoria'])) $producto->setCategoria($data['categoria']);
        if (isset($data['subcategoria'])) $producto->setSubcategoria($data['subcategoria']);
        if (isset($data['marca'])) $producto->setMarca($data['marca']);
        if (isset($data['modelo'])) $producto->setModelo($data['modelo']);
        $em->persist($producto);
        $em->flush();
        return $this->json(['mensaje' => 'Producto actualizado']);
    }
}
