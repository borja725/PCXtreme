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
    #[Route("/profile", methods: ["DELETE"])]
    public function deleteProfile(Request $request, UserRepository $userRepo, EntityManagerInterface $em)
    {
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
        $user = $userRepo->find($decoded->user_id ?? 0);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        $em->remove($user);
        $em->flush();
        return new JsonResponse(['message' => 'Cuenta eliminada correctamente']);
    }
    #[Route("/profile", methods: ["POST"])]
    public function updateProfile(Request $request, UserRepository $userRepo, EntityManagerInterface $em)
    {
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
        $user = $userRepo->find($decoded->user_id ?? 0);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        // Soporta multipart/form-data y application/json
        $contentType = $request->headers->get('Content-Type');
        if ($contentType && strpos($contentType, 'application/json') === 0) {
            $data = json_decode($request->getContent(), true);
            $name = $data['name'] ?? null;
            $email = $data['email'] ?? null;
        } else {
            $name = $request->request->get('name');
            $email = $request->request->get('email');
            // $profileImage = $request->files->get('profileImage'); // Implementar si tienes imagen
        }
        // DEBUG: Devuelve lo que recibe el backend
        if (!$name || !$email) {
            return new JsonResponse([
                'error' => 'Faltan campos obligatorios',
                'debug_name' => $name,
                'debug_email' => $email,
                'debug_post' => $request->request->all(),
                'debug_files' => $request->files->all(),
                'debug_content_type' => $contentType
            ], 400);
        }
        $user->setUsername($name);
        $user->setEmail($email);
        // Si quieres guardar la imagen, implementa aquí
        $em->persist($user);
        $em->flush();

        // Generar nuevo JWT con los datos actualizados
        $payload = [
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'exp' => (new \DateTime('+7 days'))->getTimestamp(),
        ];
        $jwt = \Firebase\JWT\JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        return new JsonResponse([
            'message' => 'Perfil actualizado correctamente',
            'token' => $jwt
        ]);
    }
    #[Route("/profile", methods: ["GET"])]
    public function getProfile(Request $request, UserRepository $userRepo)
    {
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
        $user = $userRepo->find($decoded->user_id ?? 0);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        return new JsonResponse([
            'name' => $user->getUsername(),
            'email' => $user->getEmail(),
            // 'profileImage' => $user->getProfileImage(), // Descomenta si tienes imagen
        ]);
    }
    #[Route("/change-password", methods: ["POST"])]
    public function changePassword(Request $request, UserRepository $userRepo, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em)
    {
        // Obtener token JWT del header Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(.*)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }
        $jwt = $matches[1];
        try {
            $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Token inválido'], 401);
        }
        // Obtener usuario
        $user = $userRepo->find($decoded->user_id ?? 0);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        // Obtener datos del body
        $data = json_decode($request->getContent(), true);
        $currentPassword = $data['currentPassword'] ?? null;
        $newPassword = $data['newPassword'] ?? null;
        if (!$currentPassword || !$newPassword) {
            return new JsonResponse(['error' => 'Faltan campos obligatorios'], 400);
        }
        // Verificar contraseña actual
        if (!$passwordHasher->isPasswordValid($user, $currentPassword)) {
            return new JsonResponse(['error' => 'Contraseña actual incorrecta'], 403);
        }
        // Cambiar contraseña
        $user->setPassword($passwordHasher->hashPassword($user, $newPassword));
        $em->persist($user);
        $em->flush();
        return new JsonResponse(['message' => 'Contraseña cambiada correctamente']);
    }
    
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
        $usernameOrEmail = $data['username'] ?? $data['email'] ?? null;
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
