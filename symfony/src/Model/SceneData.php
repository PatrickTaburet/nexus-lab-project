<?php

namespace App\Model;


class SceneData
{
    private string $label;
    private string $entityClass;
    private string $formType;
    private string $routeName;
    private string $sceneType;
    private object $repository;

    public function __construct(
        string $label,
        string $entityClass,
        string $formType,
        string $routeName,
        string $sceneType = 'default',
        ?object $repository = null
    )
    {
        $this->label = $label;
        $this->entityClass = $entityClass;
        $this->formType = $formType;
        $this->routeName = $routeName;
        $this->sceneType = $sceneType;
        $this->repository = $repository;
    }

    public function getLabel(): string
    {
        return $this->label;
    }
    
    public function getEntityClass(): string
    {
        return $this->entityClass;
    }

    public function getFormType(): string
    {
        return $this->formType;
    }

    public function getRouteName(): string
    {
        return $this->routeName;
    }
    public function getSceneType(): string
    {
        return $this->sceneType;
    }

    public function getRepository(): object
    {
        return $this->repository;
    }

    public function setRepository(object $repository): void
    {
        $this->repository = $repository;
    }
}