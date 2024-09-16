<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Routing\Annotation\Route;

class api_TokenController extends AbstractController
{
    private $jwtManager;
    private $manager;

    public function __construct(JWTTokenManagerInterface $jwtManager, EntityManagerInterface $manager)
    {
        $this->jwtManager = $jwtManager;
        $this->manager = $manager;
    }

    #[Route('/api/refresh_token', name: 'api_refresh_token', methods: ['POST'])]
    public function api_refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'] ?? null;
        if (!$userId) {
            return new JsonResponse(['error' => 'Username is missing'], 400);
        }

        $user = $this->manager->getRepository(User::class)->findOneBy([
            'id' => $userId,
        ]);
        if (!$user instanceof User){
            throw new AccessDeniedException('Invalid User');
        }
        $existingRefreshToken = $this->manager->getRepository(RefreshToken::class)->findOneBy([
            'username' => $user->getEmail(),
        ]);
        if (!$existingRefreshToken) {
            return new JsonResponse(['error' => 'Refresh token not found'], 403);
        }
        if ($existingRefreshToken && $existingRefreshToken->isValid()) {
            $accessToken = $this->jwtManager->create($user);
            return new JsonResponse(['token' => $accessToken]);
        } else {
            throw new AccessDeniedException('Invalid Token');
        }
    }
}