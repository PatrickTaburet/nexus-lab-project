<?php

namespace App\Entity;
use Doctrine\Common\Collections\{
    Collection,
    ArrayCollection
};
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\{
    HttpFoundation\File\File,
    Security\Core\User\UserInterface,
    Security\Core\User\PasswordAuthenticatedUserInterface,
    Validator\Constraints as Assert
};
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use App\Repository\UserRepository;
use ApiPlatform\Metadata\ApiResource;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ["email"], message: "There is already an account with this email")]
#[Vich\Uploadable]
#[ApiResource]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[Assert\NotBlank]
    #[ORM\Column(type: "string", length: 180, unique: true)]
    #[Assert\Email]
    private string $email;

    #[Assert\NotBlank]
    #[Assert\Length(
        min: 3,
        max: 50,
        minMessage: "Username must be at least {{ limit }} characters.",
        maxMessage: "Username cannot be longer than {{ limit }} characters."
    )]
    #[ORM\Column(type: "string", length: 50)]
    private string $pseudo;

    #[Assert\NotNull]
    #[Assert\Type("array")]
    #[ORM\Column(type: "json")]
    private array $roles = [];

    #[ORM\Column(type: "string")]
    private string $password;

    #[ORM\Column(type: "datetime_immutable")]
    private DateTimeImmutable $createdAt;

    // ------- VICH UPLOADER --------

    #[Vich\UploadableField(mapping: "picture_profile", fileNameProperty: "imageName")]
    #[Assert\File(
        maxSize: "2048M",
        maxSizeMessage: "The file is too large ({{ size }} MB). Maximum file size is {{ limit }} MB.",
        mimeTypes: ["image/jpeg", "image/png", "image/gif"],
        mimeTypesMessage: "Please upload a valid image file (JPG, PNG, GIF)"
    )]
    private ?File $imageFile = null;

    #[ORM\Column(nullable: true)]
    private ?string $imageName = 'no-profile.jpg'; // Define default image

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private ?DateTimeImmutable $updatedAt = null;

        // ------- Generative art scenes --------

    #[ORM\OneToMany(targetEntity: Scene1::class, mappedBy: "user", cascade: ["remove"], orphanRemoval: true)]
    private Collection $Scene1;

    #[ORM\OneToMany(targetEntity: Scene2::class, mappedBy: "user", cascade: ["remove"], orphanRemoval: true)]
    private Collection $Scene2;


       // ------- Data art scenes --------

    #[ORM\OneToMany(targetEntity: SceneD1::class, mappedBy: "user", cascade: ["remove"], orphanRemoval: true)]
    private Collection $sceneD1;

    #[ORM\OneToMany(targetEntity: SceneD2::class, mappedBy: "user", cascade: ["remove"], orphanRemoval: true)]
    private Collection $sceneD2;

       // ------- Collective drawing scenes --------

    #[ORM\OneToMany(targetEntity: CollectiveDrawing::class, mappedBy: "user", cascade: ["remove"], orphanRemoval: true)]
    private Collection $collectiveDrawing;

       // ------- Requests --------

    #[ORM\OneToOne(targetEntity: ArtistRole::class, mappedBy: "user")]
    private ?ArtistRole $role_request = null;

    #[ORM\OneToMany(targetEntity: AddScene::class, mappedBy: "user")]
    private Collection $add_scene;


//-------------------------------------------------------------------------------------------

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->Scene1 = new ArrayCollection();
        $this->Scene2 = new ArrayCollection();
        $this->sceneD1 = new ArrayCollection();
        $this->sceneD2 = new ArrayCollection();
        $this->add_scene = new ArrayCollection();
        $this->collectiveDrawing = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }
    
    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;

    }
    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    // public function getUsername(): string
    // {
    //     return (string) $this->email;
    // }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
    

    // ---------- Vich Uploader - Profile Picture ---------- //

    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $imageFile
     */
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if ($imageFile  !==  null) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new DateTimeImmutable();
        } 
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }
    
    public function clearImageFile(): void
    {
        $this->imageFile = null;
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


    public function removeFile()
    {
        if ($this->getImageName()!== 'no-profile.jpg') {
            $this->setImageFile(null);
            $this->setImageName('no-profile.jpg');
        }
    }

    // ---------- Generative art scenes ---------- //

    /**
     * @return Collection<int, Scene1>
     */
    public function getScene1(): Collection
    {
        return $this->Scene1;
    }

    public function addScene1(Scene1 $scene1): self
    {
        if (!$this->Scene1->contains($scene1)) {
            $this->Scene1[] = $scene1;
            $scene1->setUser($this);
        }

        return $this;
    }

    public function removeScene1(Scene1 $scene1): self
    {
        if ($this->Scene1->removeElement($scene1)) {
            // set the owning side to null (unless already changed)
            if ($scene1->getUser() === $this) {
                $scene1->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Scene2>
     */
    public function getScene2(): Collection
    {
        return $this->Scene2;
    }

    public function addScene2(Scene2 $scene2): self
    {
        if (!$this->Scene2->contains($scene2)) {
            $this->Scene2[] = $scene2;
            $scene2->setUser($this);
        }

        return $this;
    }

    public function removeScene2(Scene2 $scene2): self
    {
        if ($this->Scene2->removeElement($scene2)) {
            // set the owning side to null (unless already changed)
            if ($scene2->getUser() === $this) {
                $scene2->setUser(null);
            }
        }

        return $this;
    }

      // ---------- Data art scenes ---------- //

    /**
     * @return Collection<int, SceneD1>
     */
    public function getSceneD1(): Collection
    {
        return $this->sceneD1;
    }

    public function addSceneD1(SceneD1 $sceneD1): self
    {
        if (!$this->sceneD1->contains($sceneD1)) {
            $this->sceneD1[] = $sceneD1;
            $sceneD1->setUser($this);
        }

        return $this;
    }

    public function removeSceneD1(SceneD1 $sceneD1): self
    {
        if ($this->sceneD1->removeElement($sceneD1)) {
            // set the owning side to null (unless already changed)
            if ($sceneD1->getUser() === $this) {
                $sceneD1->setUser(null);
            }
        }

        return $this;
    }
    /**
     * @return Collection<int, SceneD2>
     */
    public function getSceneD2(): Collection
    {
        return $this->sceneD2;
    }

    public function addSceneD2(SceneD2 $sceneD2): self
    {
        if (!$this->sceneD2->contains($sceneD2)) {
            $this->sceneD2[] = $sceneD2;
            $sceneD2->setUser($this);
        }

        return $this;
    }

    public function removeSceneD2(SceneD2 $sceneD2): self
    {
        if ($this->sceneD2->removeElement($sceneD2)) {
            // set the owning side to null (unless already changed)
            if ($sceneD2->getUser() === $this) {
                $sceneD2->setUser(null);
            }
        }

        return $this;
    }

      // ---------- Collective drawing scenes ---------- //

    /**
     * @return Collection<int, collectiveDrawing>
     */
    public function getCollectiveDrawing(): Collection
    {
        return $this->collectiveDrawing;
    }

    public function addCollectiveDrawing(CollectiveDrawing $collectiveDrawing): self
    {
        if (!$this->collectiveDrawing->contains($collectiveDrawing)) {
            $this->collectiveDrawing[] = $collectiveDrawing;
            $collectiveDrawing->setUser($this);
        }

        return $this;
    }

    public function removeCollectiveDrawing(CollectiveDrawing $collectiveDrawing): self
    {
        if ($this->collectiveDrawing->removeElement($collectiveDrawing)) {
            // set the owning side to null (unless already changed)
            if ($collectiveDrawing->getUser() === $this) {
                $collectiveDrawing->setUser(null);
            }
        }

        return $this;
    }


    public function getRoleRequest(): ?ArtistRole
    {
        return $this->role_request;
    }

    public function setRoleRequest(?ArtistRole $role_request): self
    {
        $this->role_request = $role_request;

        return $this;
    }

    /**
     * @return Collection<int, AddScene>
     */
    public function getAddScene(): Collection
    {
        return $this->add_scene;
    }

    public function addAddScene(AddScene $addScene): self
    {
        if (!$this->add_scene->contains($addScene)) {
            $this->add_scene[] = $addScene;
            $addScene->setUser($this);
        }

        return $this;
    }

    public function removeAddScene(AddScene $addScene): self
    {
        if ($this->add_scene->removeElement($addScene)) {
            // set the owning side to null (unless already changed)
            if ($addScene->getUser() === $this) {
                $addScene->setUser(null);
            }
        }

        return $this;
    }
}
