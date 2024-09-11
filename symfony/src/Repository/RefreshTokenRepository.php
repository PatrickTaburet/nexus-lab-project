<?php

namespace App\Repository;

use App\Entity\RefreshToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RefreshToken>
 *
 * @method RefreshToken|null find($id, $lockMode = null, $lockVersion = null)
 * @method RefreshToken|null findOneBy(array $criteria, array $orderBy = null)
 * @method RefreshToken[]    findAll()
 * @method RefreshToken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RefreshTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RefreshToken::class);
    }

    public function add(RefreshToken $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RefreshToken $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // public function findValidToken(string $refreshToken): ?RefreshToken
    // {
    //     return $this->createQueryBuilder('r')
    //         ->andWhere('r.refresh_token = :token')
    //         ->andWhere('r.valid > :now')
    //         ->setParameter('token', $refreshToken)
    //         ->setParameter('now', new \DateTime())
    //         ->getQuery()
    //         ->getOneOrNullResult();
    // }

    // public function deleteExpiredTokens(): int
    // {
    //     return $this->createQueryBuilder('r')
    //         ->delete()
    //         ->where('r.valid <= :now')
    //         ->setParameter('now', new \DateTime())
    //         ->getQuery()
    //         ->execute();
    // }
}