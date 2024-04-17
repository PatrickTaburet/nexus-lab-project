<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserRepository;
use App\Form\EditUserType;

class UserController extends AbstractController
{
    
    /**
    * @Route("/profile/{id}", name="profile", methods= {"GET", "POST"})
    */
    public function editUser(Request $request, UserRepository $repo, $id) : Response
    {       
            $user = $repo->find($id);
            
            $userForm = $this->createForm(EditUserType::class, $user, [
                'is_admin' => true,
                'is_not_admin' =>false,
            ]);
            $userForm -> handleRequest($request);

            if ($userForm->isSubmitted() && $userForm->isValid()) {

                  // Handle the uploaded avatar image
                // $avatar = $user->getAvatar();
                // $user->setAvatar($avatar);
                $entityManager = $this->getDoctrine()
                                      ->getManager();
                $entityManager -> persist($user);
                $entityManager -> flush();
                $user->removeFile(); // Delete the object file after persist to avoid errors
                $this ->addFlash('message', 'User edit succeed');

                return $this->redirectToRoute('home');
            }

            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 
}
