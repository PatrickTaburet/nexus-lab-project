<?php

namespace App\Controller;

use App\Entity\{
    SceneD1,
    SceneD2,
};
use App\Form\{
    SaveArtworkD1Type,
    SaveArtworkD2Type
};
use App\Repository\{
    SceneD1Repository,
    SceneD2Repository,
};
use Symfony\Component\HttpFoundation\{
    Response,
    Request,
    JsonResponse,
    File\UploadedFile,
};
use Symfony\Component\{
    Routing\Annotation\Route,
    Serializer\SerializerInterface,
    Security\Core\Security
};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class BaseSceneController extends AbstractController
{
    protected  SerializerInterface $serializer;
    protected EntityManagerInterface $entityManager;
    protected Security $security;
    
    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }


}
