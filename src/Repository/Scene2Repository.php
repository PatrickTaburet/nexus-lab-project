<?php

namespace App\Repository;

use App\Entity\Scene2;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractSceneRepository<Scene2>
 */
class Scene2Repository extends AbstractSceneRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Scene2::class);
    }
}
