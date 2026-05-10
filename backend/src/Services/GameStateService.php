<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuthUser;
use RuntimeException;

final class GameStateService
{
    public function __construct(
        private readonly string $gameSlug,
        private readonly string $gameName
    ) {
    }

    public function initialState(): array
    {
        return [
            'game_slug' => $this->gameSlug,
            'game_name' => $this->gameName,
            'schema_version' => 2,
            'currentScreen' => 'characterCreation',
            'currentScene' => 'opening',
            'gameState' => [],
            'selectedBackground' => null,
            'currentEnding' => null,
            'metaState' => [],
            'runHistory' => [],
            'daysSurvived' => 0,
            'totalChoicesMade' => 0,
            'researchProgress' => null,
            'last_intent' => null,
            'last_intent_at' => null,
            'created_at' => gmdate('Y-m-d H:i:s'),
        ];
    }

    public function applyIntent(array $currentState, string $intent, array $payload): array
    {
        if ($intent === 'reset_game') {
            return $this->initialState();
        }

        $state = $payload['state'] ?? null;
        if (!is_array($state)) {
            throw new RuntimeException('Authoritative game state is required.');
        }

        $nextState = $this->normalizeState($state);
        $nextState['last_intent'] = $intent;
        $nextState['last_intent_at'] = gmdate('c');

        return $nextState;
    }

    public function response(array $save, AuthUser $user): array
    {
        return [
            'user' => $user->toArray(),
            'save' => [
                'id' => $save['id'],
                'slot' => $save['save_slot'],
                'state' => $this->normalizeState($save['state']),
                'metadata' => $save['metadata'],
                'version' => $save['version'],
                'status' => $save['status'],
                'created_at' => $save['created_at'],
                'updated_at' => $save['updated_at'],
            ],
        ];
    }

    private function normalizeState(array $state): array
    {
        $base = $this->initialState();
        return [
            ...$base,
            ...$state,
            'game_slug' => $this->gameSlug,
            'game_name' => $this->gameName,
            'schema_version' => 2,
            'currentScreen' => is_string($state['currentScreen'] ?? null) ? $state['currentScreen'] : $base['currentScreen'],
            'currentScene' => is_string($state['currentScene'] ?? null) ? $state['currentScene'] : $base['currentScene'],
            'gameState' => is_array($state['gameState'] ?? null) ? $state['gameState'] : [],
            'metaState' => is_array($state['metaState'] ?? null) ? $state['metaState'] : [],
            'runHistory' => is_array($state['runHistory'] ?? null) ? $state['runHistory'] : [],
            'daysSurvived' => max(0, $this->intValue($state['daysSurvived'] ?? 0)),
            'totalChoicesMade' => max(0, $this->intValue($state['totalChoicesMade'] ?? 0)),
            'researchProgress' => is_array($state['researchProgress'] ?? null) ? $state['researchProgress'] : null,
            'last_intent' => is_string($state['last_intent'] ?? null) ? $state['last_intent'] : null,
            'last_intent_at' => is_string($state['last_intent_at'] ?? null) ? $state['last_intent_at'] : null,
        ];
    }

    private function intValue(mixed $value): int
    {
        return is_numeric($value) ? (int) $value : 0;
    }
}
