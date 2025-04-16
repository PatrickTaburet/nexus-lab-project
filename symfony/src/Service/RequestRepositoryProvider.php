<?php

namespace App\Service;

use App\Repository\AddSceneRepository;
use App\Repository\ArtistRoleRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RequestRepositoryProvider 
{
    private ArtistRoleRepository $artistRoleRepo;
    private AddSceneRepository $addSceneRepo;

    public function __construct(ArtistRoleRepository $artistRoleRepo, AddSceneRepository $addSceneRepo)
    {
        $this->artistRoleRepo = $artistRoleRepo;
        $this->addSceneRepo = $addSceneRepo;
    }

    public function getRepository(string $entity)
    {
        $repositoryMap = [
            'ArtistRole' => $this->artistRoleRepo,
            'AddScene'   => $this->addSceneRepo,
        ];

        if (!isset($repositoryMap[$entity])) {
            throw new NotFoundHttpException('Entity not found');
        }

        return $repositoryMap[$entity];
    }
}