<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\LoginAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpFoundation\Request,
    PasswordHasher\Hasher\UserPasswordHasherInterface,
    Security\Http\Authentication\UserAuthenticatorInterface
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="app_register")
     */
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, UserAuthenticatorInterface $userAuthenticator, LoginAuthenticator $authenticator, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Check if user pseudo is already used.
            $userName = $user->getPseudo();
            $existingUserPseudo = $entityManager->getRepository(User::class)->findOneBy(['pseudo' => $userName]); 

            if ($existingUserPseudo){
                $this->addFlash('warning', 'Oops! Registration Error: This pseudo is already used.');
                return $this->render('registration/register.html.twig', [
                    'registrationForm' => $form->createView(),
                ]);
            }
            // Encode the plain password
            $user->setPassword(
            $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );
          
            $entityManager->persist($user);
            $entityManager->flush();
            $user->removeFile(); // Delete the object file after persist to avoid serialize errors
            $this->addFlash('success', 'Hi '.$userName . ' !  Welcome to the amazing world of generative coding art !'); 

            return $userAuthenticator->authenticateUser(
                $user,
                $authenticator,
                $request
            );

        } else if ($form->isSubmitted()) {
            // Check if user email is already used.
            $email = $form->get('email')->getData(); 
            $existingUserEmail = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]); 

            if ($existingUserEmail) {
                $this->addFlash('warning', 'Oops! Registration Error: Email adress is already used.');
            } else {
                $this->addFlash('warning', 'Oops! Registration Error: Please check your information and try again.');
            }
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }
}
