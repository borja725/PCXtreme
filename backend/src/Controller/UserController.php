<?php
namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Firebase\JWT\JWT;

#[Route('/api')]
class UserController extends AbstractController
{
    
    #[Route("/register", methods: ["POST"])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher, UserRepository $userRepo)
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$username || !$email || !$password) {
            return new JsonResponse(['error' => 'Faltan campos obligatorios'], 400);
        }
        if ($userRepo->findOneByEmail($email) || $userRepo->findOneByUsername($username)) {
            return new JsonResponse(['error' => 'Usuario o email ya existen'], 409);
        }
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $em->persist($user);
        $em->flush();
        return new JsonResponse(['message' => 'Usuario registrado correctamente']);
    }

    #[Route("/login", methods: ["POST"])]
    public function login(Request $request, UserRepository $userRepo, UserPasswordHasherInterface $passwordHasher)
    {
        $data = json_decode($request->getContent(), true);
        $usernameOrEmail = $data['usernameOrEmail'] ?? null;
        $password = $data['password'] ?? null;

        if (!$usernameOrEmail || !$password) {
            return new JsonResponse(['error' => 'Faltan campos obligatorios'], 400);
        }
        $user = $userRepo->findOneByEmail($usernameOrEmail) ?? $userRepo->findOneByUsername($usernameOrEmail);
        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Credenciales inválidas'], 401);
        }
        // JWT
        $jwt = JWT::encode([
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'exp' => time() + 3600
        ], $_ENV['JWT_SECRET'], 'HS256');
        return new JsonResponse(['token' => $jwt]);
    }
}
