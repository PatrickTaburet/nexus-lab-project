<?php

namespace App\Controller;
use App\Repository\{
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpKernel\Exception\NotFoundHttpException
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class LikeController extends AbstractController
{
    #[Route("/like/artwork/{id}/{entity}", name: "artwork_like")]
    public function like(EntityManagerInterface $entityManager, Scene1Repository $repoG1, Scene2Repository $repoG2, SceneD1Repository $repoD1, SceneD2Repository $repoD2, $id, $entity): Response
    {
        $user = $this->getUser();

        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
        } 
        elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);  
        }elseif ($entity === 'SceneD2'){
            $artwork = $repoD2->find($id);  
        }elseif ($entity === 'Scene2'){
            $artwork = $repoG2->find($id);  
        } else { 
            throw new NotFoundHttpException('Entity not found');
        }
        if ($artwork->isLikedByUser($user)){
            $artwork->removeLike($user);
            $entityManager->flush();
            $likes = $artwork->getLikes()->count();
            return $this ->json(['message'=> 'Like successfully deleted.', 'likes' => $likes]);
        }
        $artwork->addLike($user);
        $entityManager->flush();
        $likes = $artwork->getLikes()->count();
        return $this ->json(['message'=> 'Like successfully added.', 'likes' => $likes]);

    }
}
