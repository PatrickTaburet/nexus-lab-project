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
    public function refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? null;
        $existingRefreshToken = $this->manager->getRepository(RefreshToken::class)->findOneBy([
            'username' => $username,
        ]);
        if ($existingRefreshToken && $existingRefreshToken->isValid()) {
            $user = $this->getUserFromEmail($username);
            if (!$user instanceof User){
                throw new AccessDeniedException('Invalid User');
            }
            $accessToken = $this->jwtManager->create($user);
            return new JsonResponse(['token' => $accessToken]);
        } else {
            throw new AccessDeniedException('Invalid Token');
        }
   

        // $isValid = $this->isValidRefreshToken($refreshToken);

        // ob_start();

        // var_dump($isValid);

        // $isValid = $this->isValidRefreshToken($refreshToken);
        // if (!$isValid){
        //     throw new AccessDeniedException('Invalid Token');
        // }
        // $user = $this->getUserFromRefreshToken($refreshToken);
        // if (!$user instanceof User){
        //     throw new AccessDeniedException('Invalid User');
        // }
        // $accessToken = $this->jwtManager->create($user);
        // return new JsonResponse(['token' => $accessToken]);

        // $result = ob_get_clean();
        // return new JsonResponse(['token' => $result]);

    }

    // private function isValidRefreshToken($refreshToken): bool
    // {
    //     $refreshTokenEntity = $this->manager->getRepository(RefreshToken::class)->findOneBy(['refresh_token' => $refreshToken]);
    //     return $refreshTokenEntity && $refreshTokenEntity->isValid();
    // }

    private function getUserFromEmail($email): ?User
    {
        return $this->manager->getRepository(User::class)->findOneByEmail($email);
    }
}