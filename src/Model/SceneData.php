<?php

namespace App\Model;


class SceneData
{
    private string $entityClass;
    private string $formType;
    private string $routeName;
    private string $newRouteName;
    private string $sceneType;
    private object $repository;

    public function __construct(
        string $entityClass,
        string $formType,
        string $routeName,
        string $newRouteName, 
        string $sceneType = 'default',
        object $repository = null)
    {
        $this->entityClass = $entityClass;
        $this->formType = $formType;
        $this->routeName = $routeName;
        $this->newRouteName = $newRouteName;
        $this->sceneType = $sceneType;
        $this->repository = $repository;
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
    public function getNewRouteName(): string
    {
        return $this->newRouteName;
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