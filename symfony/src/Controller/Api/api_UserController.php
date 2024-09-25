<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\{
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
};

class api_UserController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;
    private $validator;
    private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
    
    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
    }

    #[Route('/api/editUser/{id}', name: 'api_user_update', methods: ['POST'])]
    public function api_updateUser(Request $request, int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }
        // if ($this->getUser() !== $user) {
        //     throw new AccessDeniedException('You can only update your own profile.');
        // }
        $username = $request->request->get('username');
        $email = $request->request->get('email');
        $password = $request->request->get('password');
        $confirmPassword = $request->request->get('confirmPassword');
        $avatar = $request->files->get('profilePicture');

        $data = [
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'confirmPassword' => $confirmPassword,
            'profilePicture' => $avatar,
        ];
        $constraints = new Assert\Collection([
            'username' => [new Assert\NotBlank(), new Assert\Type('string')],
            'email' => [new Assert\NotBlank(), new Assert\Email()],
            'password' => new Assert\AtLeastOneOf([
                new Assert\Blank(),
                new Assert\Length(['min' => 6])
            ]),
            'confirmPassword' => new Assert\AtLeastOneOf([
                new Assert\Blank(),
                new Assert\EqualTo(['value' => $password])
            ]),
            'profilePicture' => [
                new Assert\File([
                    'maxSize' => self::MAX_FILE_SIZE,
                    'mimeTypes' => [
                        'image/jpeg',
                        'image/png',
                        'image/gif'
                    ],
                ])
            ],
        ]);
 
        $violations = $this->validator->validate($data, $constraints);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getPropertyPath() . ': ' . $violation->getMessage();
            }
            return new JsonResponse(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }

        // Vérification si le pseudo existe déjà
        if ($username && $user->getPseudo() !== $username) {
            $existingUserPseudo = $this->entityManager->getRepository(User::class)->findOneBy(['pseudo' => $username]);
            if ($existingUserPseudo) {
                return new JsonResponse(['error' => 'This username is already used.'], Response::HTTP_CONFLICT);
            }
            $user->setPseudo($username);
        }

        // Vérification si l'email existe déjà
        if ($email && $user->getEmail() !== $email) {

            $existingUserEmail = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
            if ($existingUserEmail) {
                return new JsonResponse(['error' => 'This email is already used.'], Response::HTTP_CONFLICT);
            }
            // replace the username refresh token with the new email
            $existingRefreshToken = $this->entityManager->getRepository(RefreshToken::class)->findOneBy([
                'username' => $user->getEmail(),
            ]);
            $existingRefreshToken->setUsername($email);

            $user->setEmail($email);
        }
        if ($password) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $password)
            );
        }
        if ($avatar) {
            $oldAvatar = $user->getImageName();
            $fileName = uniqid() . '.' . $avatar->guessExtension();
            $avatar->move($this->getParameter('avatar_directory'), $fileName);
            $user->setImageName($fileName);
            if ($oldAvatar) {
            // Delete the old avatar file
                $oldAvatarPath = $this->getParameter('avatar_directory') . '/' . $oldAvatar;
                if (file_exists($oldAvatarPath)) {
                    unlink($oldAvatarPath);
                }
            }
        }
      
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['success' => 'User update successfully'], Response::HTTP_CREATED);
    }

    #[Route('/api/myArtworks', name: 'api_my_artworks', methods: ['GET'])]
    public function api_gallery(Request $request, Scene1Repository $repo, SceneD1Repository $repo2, Scene2Repository $repo3, SceneD2Repository $repo4): JsonResponse
    {
        try {
            $user = $this->getUser();
            $userId= $user->getId();
            $sortOption = $request->query->get('sort', "true");
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 10);
            if ($sortOption === "true"){
                $repositories = [
                    ['repo' => $repo, 'prefix' => 'Scene1_'],
                    ['repo' => $repo3, 'prefix' => 'Scene2_'],
                ];
            } else {
                $repositories = [
                    ['repo' => $repo2, 'prefix' => 'SceneD1_'],
                    ['repo' => $repo4, 'prefix' => 'SceneD2_'],
                ];
            }

            $allScenes = [];
            foreach ($repositories as $repository) {
                $scenes = $repository['repo']->findBy(['user' => $userId]);
                foreach ($scenes as $scene) {
                    $allScenes[] = [
                        'id' => $repository['prefix'] . $scene->getId(),
                        'updatedAt' => $scene->getUpdatedAt() ? $scene->getUpdatedAt()->format('Y-m-d H:i:s') : null,
                        'title' => $scene->getTitle(),
                        'comment' => $scene->getComment(),
                        'imageName' => $scene->getImageName(),
                        'likes' => count($scene->getLikes()),
                    ];
                }
            }
            usort($allScenes, function ($a, $b) {
                return strtotime($b['updatedAt']) <=> strtotime($a['updatedAt']);
            });
            $paginatedScenes = array_slice($allScenes, ($page - 1) * $limit, $limit);

            return new JsonResponse($paginatedScenes, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred while fetching the gallery.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
