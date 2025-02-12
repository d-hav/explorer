export default function renderTokenLink(data,variables,chainId) {
	const div = document.createElement('div');
	div.classList.add('text-truncate')
	const link = document.createElement('a');
	link.setAttribute('class', 'text-truncate');
	link.textContent = data.currency;
	if(!data.currency){
		link.textContent = data.smartContract;
	}
	link.href = `https://explorer.bitquery.io/${WidgetConfig.getNetwork(chainId)}/token/${data.smartContract}/nft_smart_contract`;
	div.appendChild(link);
	return div;
}
