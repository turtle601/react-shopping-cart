import React from 'react';
import styled from 'styled-components';
import ProductItem from '@/components/ProductItem';
import { Product } from '@/@types/product.type';
import { useQuery } from '@/hooks/useQuery';

const StyledProductListWrapper = styled.div`
	padding: 100px;
	display: grid;
	justify-content: space-between;
	grid-template-columns: repeat(auto-fill, minmax(282px, auto));
	grid-column-gap: 47px;
	grid-row-gap: 85px;
`;

const ProductList: React.FC = () => {
	const { data, isLoading, errorMessage } = useQuery<Product[]>('/products');

	if (errorMessage) {
		return <>{errorMessage}</>;
	}

	if (isLoading) {
		return <>로딩 중...</>;
	}

	return (
		<StyledProductListWrapper>
			{data?.map((product) => {
				return <ProductItem key={product.id} product={product} />;
			})}
		</StyledProductListWrapper>
	);
};

export default ProductList;
