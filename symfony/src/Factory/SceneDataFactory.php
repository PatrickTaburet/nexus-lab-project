<?php

namespace App\Factory;

use App\Model\SceneData;

class SceneDataFactory
{
    private array $scenesMap;

    public function __construct(array $scenesMap)
    {
        // Tableau de correspondance entre les entity et leurs propriétés 
        // (injection via le service)
        $this->scenesMap = $scenesMap;
    }

    public function createSceneData(string $entityClass): ?SceneData
    {
        if (!isset($this->scenesMap[$entityClass])) {
            return null; 
        }

        // Récupérer les détails de la scène et créer l'objet SceneData
        $repoData = $this->scenesMap[$entityClass];

        return new SceneData(
            $repoData['entityClass'],
            $repoData['formType'],
            $repoData['routeName'],
            $repoData['sceneType'],
            $repoData['repository']
        );
    }
}
