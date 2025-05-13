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
    public function index(ProductoRepository $repo, SerializerInterface $serializer): JsonResponse
    {
        $productos = $repo->findAll();
        $json = $serializer->serialize($productos, 'json', ['groups' => 'producto:read']);
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $producto = new Producto();
        $producto->setNombre($data['nombre']);
        $producto->setPrecio($data['precio']);
        $producto->setStock($data['stock']);
        $producto->setDescripcion($data['descripcion']);
        $producto->setImagenUrl($data['imagenUrl']);
        $producto->setCategoria($data['categoria']);
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
    public function delete(Producto $producto, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($producto);
        $em->flush();
        return $this->json(['mensaje' => 'Producto eliminado']);
    }
}
