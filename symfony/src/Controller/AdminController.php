<?php

namespace App\Controller;

use App\Factory\SceneDataFactory;
use App\Form\{
    EditUserType,
};
use App\Repository\{
    UserRepository,
    AddSceneRepository,
    ArtistRoleRepository
};
use Symfony\Component\ {
    HttpFoundation\Request,
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpKernel\Exception\NotFoundHttpException,
    Yaml\Yaml
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\Filesystem\Filesystem;

#[Route("/admin", name: "admin_")]

class AdminController extends AbstractController
{

    #[Route("/dashboard", name: "dashboard")]
    public function dashboard(ArtistRoleRepository $roleRepo, AddSceneRepository $newSceneRepo): Response
    {
        // Fetch and sort scene requests directly in the query
        $roleRequests = $roleRepo->findBy([], ['createdAt' => 'DESC']);
        $sceneRequests = $newSceneRepo->findBy([], ['updatedAt' => 'DESC']);

        return $this->render('admin/dashboard.html.twig', [
           'roleRequests' => $roleRequests,
           'sceneRequests' => $sceneRequests
        ]);
    }

    // Users manager dashboard

    #[Route("/users", name: "users")]
    public function usersList(UserRepository $users, PaginatorInterface $paginator, Request $request): Response
    {
        $queryBuilder = $users->createQueryBuilder('u')
            ->leftJoin('u.Scene1', 's1')->addSelect('s1')
            ->leftJoin('u.Scene2', 's2')->addSelect('s2')
            ->leftJoin('u.sceneD1', 'sd1')->addSelect('sd1')
            ->leftJoin('u.sceneD2', 'sd2')->addSelect('sd2')
            ->leftJoin('u.collectiveDrawing', 'cd')->addSelect('cd')
            ->leftJoin('s1.likes', 'l1')->addSelect('l1')
            ->leftJoin('s2.likes', 'l2')->addSelect('l2')
            ->leftJoin('sd1.likes', 'l3')->addSelect('l3')
            ->leftJoin('sd2.likes', 'l4')->addSelect('l4')
            ->leftJoin('cd.likes', 'l5')->addSelect('l5')
            ->orderBy('u.createdAt', 'DESC');
            
        $allUsers = $paginator->paginate(
            $queryBuilder,
            $request->query->getInt('page', 1),
            9
        );

        foreach ($allUsers as $user) {
            $totalArtwork = count($user->getScene1()) + count($user->getScene2()) + 
                count($user->getSceneD1()) + count($user->getSceneD2()) +
                count($user->getCollectiveDrawing());            
            $totalLikes = 0;
            foreach ([
                $user->getScene1(), 
                $user->getScene2(), 
                $user->getSceneD1(), 
                $user->getSceneD2(),
                $user->getCollectiveDrawing()
            ] as $artworks) {
                foreach ($artworks as $artwork) {
                    $totalLikes += count($artwork->getLikes());
                }
            }
    
            $user->totalArtwork = $totalArtwork;
            $user->totalLikes = $totalLikes;
        }
    
        return $this->render('admin/users.html.twig', [
            'users' => $allUsers
        ]);
    }

    #[Route("/users/edit/{id}", name: "edit_user", methods: ["GET", "POST"])]
    public function editUser(
        Request $request,
        UserRepository $repo,
        EntityManagerInterface $entityManager,
        $id
    ) : Response
    {       
            $user = $repo->find($id);
            $oldAvatar = $user->getImageName();
            $isEditingOwnProfile = $user->getId() === $this->getUser()->getId();

            $userForm = $this->createForm(EditUserType::class, $user,[
                'is_admin' => !$isEditingOwnProfile && $this->isGranted('ROLE_ADMIN'),
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
     
                $entityManager -> persist($user);
                $entityManager -> flush();
                $userEmail = $user->getEmail();
                $this ->addFlash('success', 'User '.$userEmail.' edit succeed');

                return $this->redirectToRoute('admin_users');
            }

            // Clear the object file after persist and before render to avoid serialize errors
            $user->removeFile();
            
            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 

    #[Route("/users/delete/{id}", name: "delete_user", methods: ["GET"])]
    public function deleteUser(
        UserRepository $repo,
        EntityManagerInterface $entityManager,
        $id
    ): Response
    {
        $user = $repo->find($id);
        
        // Delete the avatar file if it's not the default image
        $avatar = $user->getImageName();
        if ($avatar && $avatar !== 'no-profile.jpg') {
            unlink($this->getParameter('kernel.project_dir') . '/public/images/avatar/' . $avatar);
        }
        $entityManager->remove($user);
        $entityManager->flush();
        $userEmail = $user->getEmail();
        $this->addFlash('success', 'User '.$userEmail.' delete succeed');
        return $this->redirectToRoute('admin_users');
    }

    #[Route("/confirm/{id}", name: "confirm")]
    public function confirmDelete(UserRepository $users,  $id): Response
    {
        return $this->render('admin/confirm.html.twig', [
            'user' => $users->find($id)
        ]);
    }

    // Gallery manager dashboard
    
    #[Route("/gallery", name: "gallery")]
    public function gallery(
        SceneDataFactory $sceneDataFactory,
        PaginatorInterface $paginator,
        Request $request
    ): Response
    {
        $entities = Yaml::parseFile($this->getParameter('kernel.project_dir') . '/config/entities.yaml');
        $sceneEntity = ['Scene1', 'Scene2', 'SceneD1', 'SceneD2', 'CollectiveDrawing'];
        $allScenes = [];

        foreach ($sceneEntity as $entity) {
            $sceneData = $sceneDataFactory->createSceneData($entity);
            if ($sceneData) {
                $allScenes = array_merge($allScenes, $sceneData->getRepository()->findAll());
            }
        }
        
        usort($allScenes, function($a, $b) {
            return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
        });
        $artworks = $paginator->paginate(
            $allScenes,
            $request->query->getInt('page', 1),
            9
        );
        return $this->render('admin/artworks.html.twig', [
            'artworks' => $artworks,
            'entities' => $entities['entities']
        ]);   
    }
    
    #[Route("/gallery/delete/{id}/{entity}", name: "delete_artwork", methods: ["GET", "POST"])]
    public function deleteArtwork(
        SceneDataFactory $sceneDataFactory,
        EntityManagerInterface $entityManager,
        $id,
        $entity
    ): Response
    {
        $sceneData = $sceneDataFactory->createSceneData($entity);
        if (!$sceneData) {
            throw new NotFoundHttpException('Entity not found');
        }
        $artwork = $sceneData->getRepository()->find($id);

        if ($artwork === null) {
            throw new NotFoundHttpException('Artwork not found');
        }
        
        $artworkTitle = $artwork->getTitle();
        $entityManager->remove($artwork);
        $entityManager->flush();

        $this->addFlash('success', 'Artwork '.$artworkTitle.' delete succeed');
        return $this->redirectToRoute('admin_gallery');
    }

    #[Route("/gallery/edit/{id}/{entity}", name: "edit_artwork", methods: ["GET", "POST"])]
    public function editArtwork(
        Request $request,
        SceneDataFactory $sceneDataFactory,
        EntityManagerInterface $entityManager,
        $id,
        $entity
    ) : Response
    {       
        $sceneData = $sceneDataFactory->createSceneData($entity);
        if (!$sceneData) {
            throw new NotFoundHttpException('Entity not found');
        }
        $repository = $sceneData->getRepository();
        $formType = $sceneData->getFormType();

        $artwork = $repository->find($id);
        if (!$artwork) {
            throw new NotFoundHttpException('Artwork not found');
        }
        $form = $this->createForm($formType, $artwork);
        $form -> handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager -> persist($artwork);
            $entityManager -> flush();
            $artworkTitle = $artwork->getTitle();
            $this ->addFlash('success', 'Artwork '.$artworkTitle.' edit succeed');

            return $this->redirectToRoute('admin_gallery');
        }

        return $this->render('user/editArtwork.html.twig', [
            'artwork' => $artwork,
            'form' => $form->createView(),
            'userId' => $artwork->getUser()->getId()
        ]);
    } 

    #[Route("/request/{entity}/{id}", name: "show_request", methods: ["GET", "POST"])]
    public function showRequest(
        ArtistRoleRepository $artistRoleRepo,
        AddSceneRepository $addSceneRepo,
        $id,
        $entity
    ): Response
    {
        $repositoryMap = [
            'ArtistRole' => $artistRoleRepo,
            'AddScene' => $addSceneRepo,
        ];

        if (!array_key_exists($entity, $repositoryMap)) {
            throw new NotFoundHttpException('Entity not found');
        }
        $request = $repositoryMap[$entity]->find($id);

        if ($request === null) {
            throw new NotFoundHttpException('Request not found');
        }
        $type = $request->getType();       

        return $this->render('admin/request.html.twig', [
           'request' => $request,
           'type' => $type,
        ]);
    }

    #[Route("/delete/request/{entity}/{id}", name: "delete_request", methods: ["GET", "POST"])]
    public function deleteRequest(
        EntityManagerInterface $entityManager,
        ArtistRoleRepository $artistRoleRepo,
        AddSceneRepository $addSceneRepo,
        $id,
        $entity
    ): Response
    {
        $repositoryMap = [
            'ArtistRole' => $artistRoleRepo,
            'AddScene' => $addSceneRepo,
        ];

        if (!array_key_exists($entity, $repositoryMap)) {
            throw new NotFoundHttpException('Entity not found');
        }
        $request = $repositoryMap[$entity]->find($id);
        if (!$request) {
            throw new NotFoundHttpException('Request not found');
        }

        if ($entity === 'AddScene' && method_exists($request, 'getCodeFile')) {
            $filesystem = new Filesystem();
            $filePath = $this->getParameter('code_directory') . '/' . $request->getCodeFile();
            if ($filesystem->exists($filePath)) {
                $filesystem->remove($filePath);
            }
        }

        $entityManager->remove($request);
        $entityManager->flush();
        
        $this->addFlash('success', 'Request successfully deleted');

        return $this->redirectToRoute('admin_dashboard');
    }
}
