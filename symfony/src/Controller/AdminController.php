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
use App\Service\{
    AvatarManager,
    RequestRepositoryProvider
};
use Symfony\Component\ {
    HttpFoundation\Request,
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpKernel\Exception\NotFoundHttpException,
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\Filesystem\Filesystem;

#[Route("/admin", name: "admin_")]

class AdminController extends AbstractController
{

    public function __construct(private SceneDataFactory $sceneDataFactory){}

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
    public function usersList(
        UserRepository $userRepository,
        PaginatorInterface $paginator,
        Request $request,
    ): Response {
        // 1. Retrieve the paginated list of users using a minimal query 
        $queryBuilder = $userRepository->createQueryBuilder('u')
            ->select('u')
            ->orderBy('u.createdAt', 'DESC');
    
        $pagination = $paginator->paginate(
            $queryBuilder,
            $request->query->getInt('page', 1),
            9
        );
    
        // Extract user IDs from the paginated result for later aggregation
        $userIds = [];
        foreach ($pagination as $user) {
            $userIds[] = $user->getId();
        }
    
        if (!empty($userIds)) {
            // 2. Retrieve aggregate totals for artworks and likes for the displayed users
            $aggregatedResults = $userRepository->findUsersWithAggregatedStats($userIds);
    
            //  Build an associative map from user ID to aggregated totals
            $aggregatedMap = [];
            foreach ($aggregatedResults as $result) {
                $aggregatedMap[$result['id']] = [
                    'totalArtwork' => $result['totalArtwork'],
                    'totalLikes'   => $result['totalLikes'],
                ];
            }
    
            // 3. Attach the aggregated totals to each user object in the pagination result
            foreach ($pagination as $user) {
                $id = $user->getId();
                if (isset($aggregatedMap[$id])) {
                    $user->totalArtwork = $aggregatedMap[$id]['totalArtwork'];
                    $user->totalLikes   = $aggregatedMap[$id]['totalLikes'];
                } else {
                    $user->totalArtwork = 0;
                    $user->totalLikes   = 0;
                }
            }
        }
    
        return $this->render('admin/users.html.twig', [
            'users' => $pagination,
        ]);
    }
    

    #[Route("/users/edit/{id}", name: "edit_user", methods: ["GET", "POST"])]
    public function editUser(
        Request $request,
        UserRepository $repo,
        EntityManagerInterface $entityManager,
        AvatarManager $avatarManager,
        $id
    ) : Response
    {       
            $user = $repo->find($id);
            $isEditingOwnProfile = $user->getId() === $this->getUser()->getId();

            $userForm = $this->createForm(EditUserType::class, $user,[
                'is_admin' => !$isEditingOwnProfile && $this->isGranted('ROLE_ADMIN'),
            ]);
            $userForm -> handleRequest($request);

            if ($userForm->isSubmitted() && $userForm->isValid()) {

                $formData = $userForm->getData();
                $newAvatarFile = $formData->getImageFile();

                $avatarManager->updateAvatar($user, $newAvatarFile);
     
                $entityManager -> persist($user);
                $entityManager -> flush();
                $user->clearImageFile();
                $userEmail = $user->getEmail();
                $this ->addFlash('success', 'User '.$userEmail.' edit succeed');

                return $this->redirectToRoute('admin_users');
            }
            
            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 

    #[Route("/users/delete/{id}", name: "delete_user", methods: ["GET"])]
    public function deleteUser(
        UserRepository $repo,
        EntityManagerInterface $entityManager,
        AvatarManager $avatarManager,
        $id
    ): Response
    {
        $user = $repo->find($id);
        $avatarManager->deleteAvatar($user);

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
        PaginatorInterface $paginator,
        Request $request
    ): Response
    {
        $entityLabels = [];
        $allScenes = [];
        foreach ($this->sceneDataFactory->getScenesMap() as $entityKey => $config) {
            $sceneData = $this->sceneDataFactory->createSceneData($entityKey);
            if ($sceneData) {
                $allScenes = array_merge($allScenes, $sceneData->getRepository()->findAll());
 
            }
            $entityLabels[$entityKey] = $sceneData->getLabel();
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
            'entities' => $entityLabels
        ]);   
    }
    
    #[Route("/gallery/delete/{id}/{entity}", name: "delete_artwork", methods: ["GET", "POST"])]
    public function deleteArtwork(
        EntityManagerInterface $entityManager,
        $id,
        $entity
    ): Response
    {
        $sceneData = $this->sceneDataFactory->createSceneData($entity);
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
        EntityManagerInterface $entityManager,
        $id,
        $entity
    ) : Response
    {       
        $sceneData = $this->sceneDataFactory->createSceneData($entity);
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

    #[Route("/request/{entity}/{id}", name: "show_request", methods: ["GET"])]
    public function showRequest(
        RequestRepositoryProvider $requestRepositoryProvider,
        string $entity,
        int $id
    ): Response
    {
        $entityRepo = $requestRepositoryProvider->getRepository($entity);
        $sceneRequest  = $entityRepo->find($id);

        if (!$sceneRequest ) {
            throw new NotFoundHttpException('Request not found');
        }

        $type = $sceneRequest->getType();       

        return $this->render('admin/request.html.twig', [
           'request' => $sceneRequest,
           'type' => $type,
        ]);
    }

    #[Route("/delete/request/{entity}/{id}", name: "delete_request", methods: ["GET", "POST"])]
    public function deleteRequest(
        EntityManagerInterface $entityManager,
        RequestRepositoryProvider $requestRepositoryProvider,
        string $entity,
        int $id
    ): Response
    {
        $entityRepo = $requestRepositoryProvider->getRepository($entity);
        $sceneRequest  = $entityRepo->find($id);

        if (!$sceneRequest) {
            throw new NotFoundHttpException('Request not found');
        }

        if ($entity === 'AddScene' && method_exists($sceneRequest, 'getCodeFile')) {
            $filesystem = new Filesystem();
            $filePath = $this->getParameter('code_directory') . '/' . $sceneRequest->getCodeFile();
            if ($filesystem->exists($filePath)) {
                $filesystem->remove($filePath);
            }
        }

        $entityManager->remove($sceneRequest);
        $entityManager->flush();
        
        $this->addFlash('success', 'Request successfully deleted');

        return $this->redirectToRoute('admin_dashboard');
    }
}
