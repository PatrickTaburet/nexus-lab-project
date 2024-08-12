<?php

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class ClassNameExtension extends AbstractExtension
{
    public function getFilters()
    {
        return [
            new TwigFilter('class_name', [$this, 'getClassName']),
        ];
    }

    public function getClassName($object)
    {
        return get_class($object);
    }
}