<?php

namespace App\Service;

class OptionFieldProcessor
{
    public function appendCustomChoice(array $choices, ?string $customValue, string $triggerValue = 'other'): array
    {
        if ($customValue && in_array($triggerValue, $choices)) {
            $choices[] = $customValue;
        }

        return $choices;
    }
}
