<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;
use App\Repository\AddSceneRepository;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AddSceneRepository::class)]
#[Vich\Uploadable]
class AddScene
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private $id;

    #[ORM\Column(type: "array", nullable: true)]
    #[Assert\NotBlank(message: "Please select at least one language.")]
    private $language;

    #[ORM\Column(type: "string", length: 100)]
    #[Assert\NotBlank(message: "The title is required.")]
    #[Assert\Length(max: 100, maxMessage: "The title cannot exceed {{ limit }} characters.")]
    private $title;

    #[ORM\Column(type: "text")]
    #[Assert\NotBlank(message: "The description is required.")]
    private $description;

    #[ORM\Column(type: "string", length: 255)]
    private $code_file;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "add_scene")]
    #[ORM\JoinColumn(nullable: false)]
    private $user;

    // --------- VICH UPLOADER-----------------

    #[UploadableField(mapping: "addSceneImg", fileNameProperty: "imageName")]
    #[Assert\NotBlank(message: "A image file is required.")]
    #[Assert\File(
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        mimeTypesMessage: 'Please upload a valid image file.'
    )]
    private ?File $imageFile = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private $imageName;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private $updatedAt;



//-------------------------------------------------------------------------------------------

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string[]|null
     */
    public function getLanguage():?array
    {
        return $this->language;
    }

    public function setLanguage(array $language): self
    {
        $this->language = $language;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getCodeFile(): ?string
    {
        return $this->code_file;
    }

    public function setCodeFile(string $code_files): self
    {
        $this->code_file = $code_files;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    // --------- VICH UPLOADER-----------------
    
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

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
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

    public function getType(): string
    {
        return 'AddScene';
    }
}
