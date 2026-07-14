export const ACTION_REFERENCES = Object.freeze({
	'actions/checkout': {
		version: 'v4',
		sha: '34e114876b0b11c390a56381ad16ebd13914f8d5'
	},
	'actions/setup-node': {
		version: 'v4',
		sha: '49933ea5288caeca8642d1e84afbd3f7d6820020'
	},
	'pnpm/action-setup': {
		version: 'v4',
		sha: 'f40ffcd9367d9f12939873eb1018b921a783ffaa'
	},
	'changesets/action': {
		version: 'v1',
		sha: 'a45c4d594aa4e2c509dc14a9f2b3b67ba3780d0d'
	}
})

export function applyActionPinning(workflow, mode) {
	if (mode !== 'sha') return workflow
	let result = workflow
	for (const [name, reference] of Object.entries(ACTION_REFERENCES)) {
		result = result.replaceAll(
			`uses: ${name}@${reference.version}`,
			`uses: ${name}@${reference.sha} # ${reference.version}`
		)
	}
	return result
}
