<?php

namespace App\Factory;

use App\Model\SceneData;

class SceneDataFactory
{
    private array $repositoryMap;

    public function __construct(array $repositoryMap)
    {
        // Le tableau de correspondance entre les entités et les dépôts (injection via le service)
        $this->repositoryMap = $repositoryMap;
    }

    public function createSceneData(string $entityClass): ?SceneData
    {
        if (!isset($this->repositoryMap[$entityClass])) {
            return null; 
        }

        // Récupérer les détails de la scène et créer l'objet SceneData
        $repoData = $this->repositoryMap[$entityClass];

        return new SceneData(
            $repoData['entityClass'],
            $repoData['formType'],
            $repoData['routeName'],
            $repoData['sceneType'],
            $repoData['repository']
        );
    }
}
