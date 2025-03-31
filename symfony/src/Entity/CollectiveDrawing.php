<?php

namespace App\Entity;

use App\Repository\CollectiveDrawingRepository;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\File\File;

#[ORM\Entity(repositoryClass: CollectiveDrawingRepository::class)]
#[Vich\Uploadable]
class CollectiveDrawing extends BaseScene
{
    #[ORM\Column(type: "array")]
    private array $data = [];
    
    // --------- Communs settings -----------------
    
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "collectiveDrawing")]
    #[ORM\JoinColumn(nullable: false)]
    protected $user;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "collectiveDrawing_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\JoinTable(name: "user_collectiveDrawing_like")]
    protected $likes;
    
    // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    protected ?DateTimeImmutable $updatedAt = null;
    
    #[UploadableField(mapping: "CollectiveDrawingImages", fileNameProperty: "imageName")]
    protected ?File $imageFile ;

    //-------------------------------------------------------------------------------------------

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }   
}
