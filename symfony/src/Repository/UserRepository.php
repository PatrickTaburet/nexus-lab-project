<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function add(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->add($user, true);
    }

     /**
     * Retrieve aggregate totals for artworks and likes for the displayed users
     */
    public function findUsersWithAggregatedStats(array $userIds): array
    {
        $dql = "
            SELECT u.id,
                (COUNT(DISTINCT s1.id) + COUNT(DISTINCT s2.id) + COUNT(DISTINCT sd1.id) + COUNT(DISTINCT sd2.id) + COUNT(DISTINCT cd.id)) AS totalArtwork,
                (COUNT(DISTINCT l1.id) + COUNT(DISTINCT l2.id) + COUNT(DISTINCT l3.id) + COUNT(DISTINCT l4.id) + COUNT(DISTINCT l5.id)) AS totalLikes
            FROM App\Entity\User u
            LEFT JOIN u.Scene1 s1
            LEFT JOIN u.Scene2 s2
            LEFT JOIN u.sceneD1 sd1
            LEFT JOIN u.sceneD2 sd2
            LEFT JOIN u.collectiveDrawing cd
            LEFT JOIN s1.likes l1
            LEFT JOIN s2.likes l2
            LEFT JOIN sd1.likes l3
            LEFT JOIN sd2.likes l4
            LEFT JOIN cd.likes l5
            WHERE u.id IN (:ids)
            GROUP BY u.id
        ";

        return $this->getEntityManager()
                    ->createQuery($dql)
                    ->setParameter('ids', $userIds)
                    ->getResult();
    }

//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
