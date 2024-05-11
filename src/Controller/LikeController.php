<?php

namespace App\Controller;

use App\Entity\Scene1;
use App\Repository\Scene1Repository;
use App\Repository\SceneD1Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class LikeController extends AbstractController
{
    /**
     * @Route("/like/artwork/{id}/{entity}", name="artwork_like")
     */
    public function like(EntityManagerInterface $entityManager, Scene1Repository $repoG1, SceneD1Repository $repoD1, $id, $entity): Response
    {
        $user = $this->getUser();
       



        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
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
        // elseif ($entity === 'SceneD1'){
        //     $artwork = $repoD1->find($id);
        
        //     $userId = $artwork->getUser()->getId();
            
        // } else { 
        //     throw new NotFoundHttpException('Entity not found');
        // }

        return new Response();
    }
}
