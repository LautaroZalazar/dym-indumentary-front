import { useFetchVariantsByProductQuery } from '../../../../redux/slices/variant.slice';
import { IVariant } from '../../../../models/variant/variant.model';

interface IProps {
	productId: string;
}

const nameOf = (ref: any, field: 'name'): string =>
	typeof ref === 'object' && ref !== null ? ref[field] ?? '-' : '-';

const hexOf = (ref: any): string | undefined =>
	typeof ref === 'object' && ref !== null ? ref.hex : undefined;

const ProductVariantsInline: React.FC<IProps> = ({ productId }) => {
	const { data, isLoading } = useFetchVariantsByProductQuery(productId);

	if (isLoading) {
		return (
			<tr>
				<td colSpan={6} className='px-10 py-2 text-xs text-dymAntiPop/40 bg-white/[0.02]'>
					Cargando variantes...
				</td>
			</tr>
		);
	}

	const variants: IVariant[] = data?.variants ?? [];

	if (variants.length === 0) {
		return (
			<tr>
				<td colSpan={6} className='px-10 py-2 text-xs text-dymAntiPop/40 bg-white/[0.02] italic'>
					Sin variantes cargadas.
				</td>
			</tr>
		);
	}

	return (
		<tr>
			<td colSpan={6} className='p-0 bg-white/[0.025]'>
				<div className='ml-10 mr-4 my-1 border-l-2 border-dymOrange/25 pl-4'>
					<table className='w-full text-xs'>
						<thead>
							<tr className='text-dymAntiPop/35 uppercase tracking-wider'>
								<th className='text-left py-1.5 pr-6 font-semibold'>SKU</th>
								<th className='text-left py-1.5 pr-6 font-semibold'>Talle</th>
								<th className='text-left py-1.5 pr-6 font-semibold'>Color</th>
								<th className='text-right py-1.5 font-semibold'>Stock</th>
							</tr>
						</thead>
						<tbody>
							{variants.map((v) => (
								<tr key={v._id} className='border-t border-white/[0.04]'>
									<td className='py-1.5 pr-6 font-mono text-dymAntiPop/70 tracking-wide'>
										{v.sku || '—'}
									</td>
									<td className='py-1.5 pr-6 text-dymAntiPop/60'>
										{nameOf(v.size, 'name')}
									</td>
									<td className='py-1.5 pr-6'>
										<span className='inline-flex items-center gap-1.5'>
											<span
												className='w-3 h-3 rounded-full border border-white/20 shrink-0'
												style={{ backgroundColor: hexOf(v.color) }}
											/>
											<span className='text-dymAntiPop/60 capitalize'>
												{nameOf(v.color, 'name')}
											</span>
										</span>
									</td>
									<td className='py-1.5 text-right'>
										{(v.quantity ?? 0) > 0 ? (
											<span className='text-green-500 font-medium'>
												{v.quantity} u.
											</span>
										) : (
											<span className='text-red-500 font-medium'>Sin stock</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</td>
		</tr>
	);
};

export default ProductVariantsInline;
