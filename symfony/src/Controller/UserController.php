<?php

namespace App\Controller;

use App\Entity\ArtistRole;
use App\Factory\SceneDataFactory;
use App\Form\{
    EditUserType,
    UserPasswordType,
    ArtistRoleType,
};
use App\Repository\{
    UserRepository
};
use App\Service\AvatarManager;
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpFoundation\Request,
    PasswordHasher\Hasher\UserPasswordHasherInterface,
};
use Symfony\Component\HttpKernel\Exception\{
    NotFoundHttpException,
    AccessDeniedHttpException
};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route("/profile")]
class UserController extends AbstractController
{

    public function __construct(private SceneDataFactory $sceneDataFactory) {}
    
    #[Route("/edit/{id}", name: "profile", methods: ["GET", "POST"])]
    public function editUser(EntityManagerInterface $entityManager, Request $request, UserRepository $repo, AvatarManager $avatarManager, $id) : Response
    {       
            $user = $repo->find($id);
            // Check if the user is logged
            if (!$this->getUser()) {
                return $this->redirectToRoute('login');
            }
            // Check if the logged-in user is the same as the user being edited
            if ($this->getUser() !== $user) {
                // If not, redirect the user to the home page
                return $this->redirectToRoute('home');
            }
            
            $userForm = $this->createForm(EditUserType::class, $user, [
                'is_admin' => false,
            ]);
            
            $userForm -> handleRequest($request);
            
            if ($userForm->isSubmitted() && $userForm->isValid()) {

                $formData = $userForm->getData();
                $newAvatarFile = $formData->getImageFile();
                
                $avatarManager->updateAvatar($user, $newAvatarFile);

                $entityManager->persist($user);
                $entityManager->flush();
                $user->clearImageFile(); // Clear the object file after persist and before render to avoid serialize errors
                $userEmail = $user->getEmail();
                $this ->addFlash('success', 'User '.$userEmail.' edit succeed');

                return $this->redirectToRoute('home');
            }

            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 
    
    #[Route("/edit/password/{id}", name: "editPassword", methods: ["GET", "POST"])]
    public function editPassword(EntityManagerInterface $entityManager, Request $request, UserRepository $repo, $id, UserPasswordHasherInterface $hasher ): Response
    {
        $user = $repo->find($id);
        $userId = $user->getId();
        // Check if the user is logged
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        }
        
        // Check if the logged-in user is the same as the user being edited
        if ($this->getUser() !== $user) {
            // If not, redirect the user to the home page
            return $this->redirectToRoute('home');
        }

        $form = $this->createForm(UserPasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) { 
            $plainPassword = $form->get('plainPassword')->getData();
            $newPassword = $form->get('newPassword')->getData();
        
            if($hasher->isPasswordValid($user, $plainPassword)){
                $user->setPassword(
                    $hasher->hashPassword($user, $newPassword)
                );
                
                $entityManager->persist($user);
                $entityManager->flush();

                $this ->addFlash('success', 'User password successfully edited');
                return $this->redirectToRoute('profile', ['id' => $id]);

            } else {
                $this ->addFlash('warning', 'Incorrect password');
            }
        }
        return $this->render('user/editPassword.html.twig', [
            'form' => $form->createView(),
            'userId' => $userId
        ]);
    }


    #[Route("/myArtworks/{id}", name: "myArtworks", methods: ["GET", "POST"])]
    public function myArtworks(int $id) : Response
    {       
        $scenesG = [];
        $scenesD = [];
        $drawings = [];
        $entityLabels = [];

       foreach ($this->sceneDataFactory->getScenesMap() as $entityKey => $config) {
            $sceneData = $this->sceneDataFactory->createSceneData($entityKey);
            if (!$sceneData) {
                continue;
            }
            $entityLabels[$entityKey] = $sceneData->getLabel();

            $items = $sceneData->getRepository()->findBy(['user' => $id]);

            switch ($sceneData->getSceneType()) {
                case 'generative_scene':
                    $scenesG = array_merge($scenesG, $items);
                    break;
                case 'data_scene':
                    $scenesD = array_merge($scenesD, $items);
                    break;
                case 'collective_drawing':
                    $drawings = array_merge($drawings, $items);
                    break;
            }
        }

        usort($scenesG, fn($a, $b) => $b->getUpdatedAt() <=> $a->getUpdatedAt());
        usort($scenesD, fn($a, $b) => $b->getUpdatedAt() <=> $a->getUpdatedAt());
        usort($drawings, fn($a, $b) => $b->getUpdatedAt() <=> $a->getUpdatedAt());

        $data = [
            'scenesG'  => $scenesG,
            'sceneD'   => $scenesD,
            'drawing'  => $drawings,
        ];    
        
        return $this->render('user/myArtworks.html.twig', [
            'artworks' => $data,
            'entities' => $entityLabels
        ]);
    } 

    #[Route("/myArtworks/delete/{id}/{entity}", name: "deleteArtwork", methods: ["GET", "POST"])]
    public function Delete(
        EntityManagerInterface $entityManager,
        $id,
        $entity,
        Request $request
    ): Response
    {
        $currentUser = $this->getUser();
        $sceneData = $this->sceneDataFactory->createSceneData($entity);
        if (!$sceneData){
            throw new NotFoundHttpException('Entity not found');
        }

        $repo = $sceneData->getRepository();
        $artwork = $repo->find($id);

        if (!$artwork || $artwork->getUser() !== $currentUser) {
            throw new AccessDeniedHttpException('You are not allowed to delete this artwork.');
        }
        $userId = $artwork->getUser()->getId();  
       
        $entityManager->remove($artwork);
        $entityManager->flush();

        $this->addFlash('success', 'Artwork removed from gallery!'); 
        // Check if redirect parameter is present and true
        if ($request->query->get('redirect')) {
            return $this->redirectToRoute('home');
        }
    
        return $this->redirectToRoute('myArtworks', [
            'id' => $userId
        ]);
    }

    #[Route("/myArtworks/update/{id}/{entity}", name: "editArtwork", methods: ["GET", "POST"])]
    public function Update(
        Request $request, 
        EntityManagerInterface $entityManager, 
        $id, 
        $entity
    ): Response
    {
        $currentUser = $this->getUser();
        $sceneData = $this->sceneDataFactory->createSceneData($entity);
        
        if (!$sceneData) {
            throw new NotFoundHttpException('Entity not found');
        }

        $repo = $sceneData->getRepository();
        $formType = $sceneData->getFormType();
        
        $artwork = $repo->find($id);
        if (!$artwork || $artwork->getUser() !== $currentUser) {
            throw new AccessDeniedHttpException('You are not allowed to edit this artwork.');
        }

        $form = $this->createForm($formType, $artwork);
        $form->handleRequest($request);

        if ( $form->isSubmitted() && $form->isValid()){
            $entityManager->persist($artwork);
            $entityManager->flush();

            $this->addFlash('success', 'Artwork updated successfully'); 
          
            return $this->redirectToRoute('myArtworks', [
                'id' => $artwork->getUser()->getId()
            ]);
        }
        return $this->render('user/editArtwork.html.twig', [
            'userId' => $artwork->getUser()->getId(),
            'form' => $form->createView(),
            'artwork' => $artwork
        ]);
    }
    
    #[Route("/roleRequest", name: "roleRequest", methods: ["GET", "POST"])]
    public function roleRequest( EntityManagerInterface $entityManager, Request $request): Response
    {   
         // Check if the current user has already sent a role request
        $existingRoleRequest = $entityManager->getRepository(ArtistRole::class)->findOneBy([
            'user' => $this->getUser(),
        ]);
        if ($existingRoleRequest) {
            // If the user has already sent a role request, redirect to the home page
            $this->addFlash('warning', "You have already sent a role request. We'll get back to you as soon as possible. 
            Contact us if you need any changes or clarifications.");
            return $this->redirectToRoute('home');
        };

        $roleRequest = new ArtistRole(); 
        $roleRequest->setUser($this->getUser());

        $form = $this->createForm(ArtistRoleType::class, $roleRequest); 
        $form -> handleRequest($request); 

        if ( $form->isSubmitted() && $form->isValid()){
            $entityManager->persist($roleRequest);
            $entityManager->flush();

            $this->addFlash('success', 'Role request sent'); 

            return $this->redirectToRoute('home');
        }
        return $this->render('admin/artistForm.html.twig', [
            'form' => $form->createView(),
        ]);
    }


}
