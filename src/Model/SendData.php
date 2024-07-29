<?php

namespace App\Model;


class SceneData
{
    private string $entityClass;
    private string $formType;
    private string $routeName;
    private string $newRouteName;
    private string $viewType;
    private string $repositoryClass;

    public function __construct(
        string $entityClass,
        string $formType,
        string $routeName,
        string $newRouteName, 
        string $viewType = 'default',
        string $repositoryClass = '')
    {
        $this->entityClass = $entityClass;
        $this->formType = $formType;
        $this->routeName = $routeName;
        $this->newRouteName = $newRouteName;
        $this->viewType = $viewType;
        $this->repositoryClass = $repositoryClass;
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
        return $this->viewType;
    }

    public function getRepositoryClass(): string
    {
        return $this->repositoryClass;
    }
}