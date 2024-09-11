<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class api_UserController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;
    private $validator;

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
    public function updateUser(Request $request, int $id): JsonResponse
    {
        // var_dump("dump" . $id);
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
        $profilePicture = $request->files->get('profilePicture');
        // var_dump("username : " . $username);
        // var_dump("email : " . $email);
        // var_dump($password); 
        // var_dump($confirmPassword); 
        $data = [
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'confirmPassword' => $confirmPassword,
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
        if ($email  && $user->getEmail() !== $email) {
            $existingUserEmail = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
            if ($existingUserEmail) {
                return new JsonResponse(['error' => 'This email is already used.'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($email);
        }
        if (isset($password)) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $password)
            );
        }
        $profilePicture = $request->files->get('profilePicture');
        if ($profilePicture) {
            $fileName = uniqid() . '.' . $profilePicture->guessExtension();
            $profilePicture->move($this->getParameter('avatar_directory'), $fileName);
            $user->setImageName($fileName);
        }
      
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['success' => 'User update successfully'], Response::HTTP_CREATED);
    }
}
