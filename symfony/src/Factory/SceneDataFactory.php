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

    /**
     * Retourne toute la map injectée (clé = nom court, valeur = config)
     */
    public function getScenesMap(): array
    {
        return $this->scenesMap;
    }

    /**
     * Crée l'objet SceneData pour une clé d'entité donnée, ou null si pas supportée
     */
    public function createSceneData(string $entityKey): ?SceneData
    {
        if (!isset($this->scenesMap[$entityKey])) {
            return null; 
        }

        // Récupérer les détails de la scène et créer l'objet SceneData
        $config = $this->scenesMap[$entityKey];
        
        return new SceneData(
            $config['label'],
            $config['entityClass'],
            $config['formType'],
            $config['routeName'],
            $config['sceneType'],
            $config['repository'],
        );
    }
}
