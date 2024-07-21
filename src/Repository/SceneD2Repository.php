<?php

namespace App\Repository;

use App\Entity\SceneD2;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractSceneRepository<SceneD2>
 */
class SceneD2Repository extends AbstractSceneRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SceneD2::class);
    }
}
