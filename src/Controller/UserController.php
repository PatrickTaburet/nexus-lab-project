<?php

namespace App\Controller;

use App\Entity\ArtistRole;
use App\Form\{
    EditUserType,
    SaveArtworkD1Type,
    SaveArtworkD2Type,
    SaveArtworkG1Type,
    SaveArtworkG2Type,
    UserPasswordType,
    ArtistRoleType,
};
use App\Repository\{
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
    UserRepository
};
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpFoundation\Request,
    PasswordHasher\Hasher\UserPasswordHasherInterface,
    Yaml\Yaml
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
    
    #[Route("/edit/{id}", name: "profile", methods: ["GET", "POST"])]
    public function editUser(EntityManagerInterface $entityManager, Request $request, UserRepository $repo, $id) : Response
    {       
            $user = $repo->find($id);
            $oldAvatar = $user->getImageName();
            // Check if the user is logged
            if (!$this->getUser()) {
                return $this->redirectToRoute('gallery');
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

                // Check if the new avatar is different from the old one and from the default image
                $formData = $userForm->getData();
                $newAvatarFile = $formData->getImageFile();
                if($newAvatarFile){
                    $newAvatar = $newAvatarFile->getClientOriginalName();
                    if ($newAvatar !== $oldAvatar) {
                        // Check if the new avatar already exists in the directory
                        $avatarDir = $this->getParameter('kernel.project_dir') . '/public/images/avatar/';
                        if (!file_exists($avatarDir . $newAvatar)) {
                            // Delete the old avatar file
                            if ($oldAvatar && $oldAvatar !== 'no-profile.jpg') {
                                unlink($avatarDir . $oldAvatar);
                            }
                        }
                    }
                }

                $entityManager->persist($user);
                $entityManager->flush();
                $userEmail = $user->getEmail();
                $user->removeFile();
                $this ->addFlash('success', 'User '.$userEmail.' edit succeed');

                return $this->redirectToRoute('home');
            }

            // Clear the object file after persist and before render to avoid serialize errors
            $user->removeFile();

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
    public function myArtworks(
        Scene1Repository $repoG1,
        Scene2Repository $repoG2,
        SceneD1Repository $repoD1,
        SceneD2Repository $repoD2,
        $id,
    ) : Response
    {       
        $entities = Yaml::parseFile($this->getParameter('kernel.project_dir') . '/config/entities.yaml');
        $sceneG1 = $repoG1->findBy(['user' => $id]);
        $sceneG2 = $repoG2->findBy(['user' => $id]);
        $sceneD1 = $repoD1->findBy(['user' => $id]);
        $sceneD2 = $repoD2->findBy(['user' => $id]);
        $allScenesG = array_merge($sceneG1, $sceneG2);
        $allScenesD = array_merge($sceneD1, $sceneD2);
        usort($allScenesG, function($a, $b) {
            return $b->getUpdatedAt() <=> $a->getUpdatedAt();
        });
    
        usort($allScenesD, function($a, $b) {
            return $b->getUpdatedAt() <=> $a->getUpdatedAt();
        });
        $data = [
            'scenesG' =>  $allScenesG,
            'sceneD' => $allScenesD,
        ];
        
        return $this->render('user/myArtworks.html.twig', [
            'artworks' => $data,
            'entities' => $entities['entities']
        ]);
    } 

    #[Route("/myArtworks/delete/{id}/{entity}", name: "deleteArtwork", methods: ["GET", "POST"])]
    public function Delete(
        EntityManagerInterface $entityManager,
        Scene1Repository $repoG1,
        Scene2Repository $repoG2,
        SceneD1Repository $repoD1,
        SceneD2Repository $repoD2,
        $id,
        $entity,
        Request $request
    ): Response
    {

        $currentUser = $this->getUser();

        switch ($entity) {
            case 'Scene1':
                $artwork = $repoG1->find($id);
                break;
            case 'SceneD1':
                $artwork = $repoD1->find($id);
                break;
            case 'SceneD2':
                $artwork = $repoD2->find($id);
                break;
            case 'Scene2':
                $artwork = $repoG2->find($id);
                break;
            default:
                throw new NotFoundHttpException('Entity not found');
        }

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
    public function Update(Request $request, EntityManagerInterface $entityManager, Scene1Repository $repoG1, Scene2Repository $repoG2,SceneD2Repository $repoD2, SceneD1Repository $repoD1, $id, $entity): Response
    {
        $currentUser = $this->getUser();

        $entityMappings = [
            'Scene1' => ['repo' => $repoG1, 'formType' => SaveArtworkG1Type::class],
            'Scene2' => ['repo' => $repoG2, 'formType' => SaveArtworkG2Type::class],
            'SceneD1' => ['repo' => $repoD1, 'formType' => SaveArtworkD1Type::class],
            'SceneD2' => ['repo' => $repoD2, 'formType' => SaveArtworkD2Type::class],
        ];

        if (!isset($entityMappings[$entity])) {
            throw new NotFoundHttpException('Entity not found');
        }

        $repo = $entityMappings[$entity]['repo'];
        $formType = $entityMappings[$entity]['formType'];
        
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
