<?php

namespace App\Entity;

use App\Repository\CollectiveDrawingRepository;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

use DateTimeImmutable;
use Symfony\Component\{
    HttpFoundation\File\File,
    Serializer\Annotation\Groups
};

#[ORM\Entity(repositoryClass: CollectiveDrawingRepository::class)]
#[Vich\Uploadable]
class CollectiveDrawing extends BaseScene
{
    #[ORM\Column]
    #[Groups("sceneDataRecup")]
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
    private $updatedAt;
    
    #[UploadableField(mapping: "collectiveDrawing", fileNameProperty: "imageName")]
    private ?File $imageFile = null;

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

    // ---------- Vich Uploader - Screen Artwork ---------- //
    
    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $imageFile
     */
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't b    e called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    

}
