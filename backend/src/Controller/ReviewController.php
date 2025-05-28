<?php

namespace App\Controller;

use App\Entity\Review;
use App\Entity\Producto;
use App\Repository\ReviewRepository;
use App\Repository\ProductoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ReviewController extends AbstractController
{
    #[Route('/api/productos/{id}/reviews', name: 'get_product_reviews', methods: ['GET'])]
    public function getReviews($id, ReviewRepository $reviewRepository, ProductoRepository $productoRepository): Response
    {
        $producto = $productoRepository->find($id);
        if (!$producto) {
            return $this->json(['error' => 'Producto no encontrado'], 404);
        }
        $reviews = $reviewRepository->findBy(['producto' => $producto], ['createdAt' => 'DESC']);
        $data = array_map(function($r) {
            return [
                'id' => $r->getId(),
                'user' => $r->getUserName(),
                'rating' => $r->getRating(),
                'comment' => $r->getComment(),
                'createdAt' => $r->getCreatedAt()->format('Y-m-d H:i'),
            ];
        }, $reviews);
        return $this->json($data);
    }

    #[Route('/api/productos/{id}/reviews', name: 'add_product_review', methods: ['POST'])]
  
    public function addReview($id, Request $request, ProductoRepository $productoRepository, EntityManagerInterface $em): Response
    {
        $producto = $productoRepository->find($id);
        if (!$producto) {
            return $this->json(['error' => 'Producto no encontrado'], 404);
        }
        $data = json_decode($request->getContent(), true);
        $rating = $data['rating'] ?? null;
        $comment = $data['comment'] ?? '';
        $username = $data['user'] ?? 'Anónimo';
        if (!$rating || $rating < 1 || $rating > 5) {
            return $this->json(['error' => 'Puntuación inválida'], 400);
        }
        if (strlen(trim($comment)) < 3) {
            return $this->json(['error' => 'Comentario demasiado corto'], 400);
        }
        $review = new Review();
        $review->setProducto($producto);
        $review->setUserName($username);
        $review->setRating($rating);
        $review->setComment($comment);
        $review->setCreatedAt(new \DateTime());
        $em->persist($review);
        $em->flush();
        return $this->json(['message' => 'Reseña añadida']);
    }
}
