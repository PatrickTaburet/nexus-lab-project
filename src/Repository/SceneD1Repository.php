<?php

namespace App\Repository;

use App\Entity\SceneD1;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractSceneRepository<SceneD1>
 */
class SceneD1Repository extends AbstractSceneRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SceneD1::class);
    }
}
