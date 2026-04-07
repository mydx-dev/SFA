export interface Phase {
    id: string;
    name: string;
    order: number;
}

let _phases: Phase[] = [];

export async function getPhases(): Promise<Phase[]> {
    return [..._phases];
}

export async function createPhase(name: string): Promise<Phase> {
    const phase: Phase = { id: `phase-${Date.now()}`, name, order: _phases.length };
    _phases = [..._phases, phase];
    return phase;
}

export async function updatePhase(id: string, updates: Partial<Omit<Phase, "id">>): Promise<Phase> {
    const index = _phases.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Phase not found");
    _phases = _phases.map(p => (p.id === id ? { ...p, ...updates } : p));
    return _phases[index];
}

export async function deletePhase(id: string): Promise<void> {
    _phases = _phases.filter(p => p.id !== id);
}

export async function reorderPhases(orderedIds: string[]): Promise<Phase[]> {
    _phases = orderedIds.map((id, index) => {
        const phase = _phases.find(p => p.id === id);
        if (!phase) throw new Error(`Phase not found: ${id}`);
        return { ...phase, order: index };
    });
    return [..._phases];
}
