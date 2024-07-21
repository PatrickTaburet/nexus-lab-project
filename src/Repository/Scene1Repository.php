<?php

namespace App\Repository;

use App\Entity\Scene1;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractSceneRepository<Scene1>
 */
class Scene1Repository extends AbstractSceneRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Scene1::class);
    }
}
