import React from 'react';
import { IPaginationProps } from './models/pagination-props'
import chevronDownIcon from '../../../../assets/SVG/chevronDownIcon.svg'

const Pagination: React.FC<IPaginationProps> = ({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			let startPage = Math.max(
				currentPage - Math.floor(maxVisiblePages / 2),
				1
			);
			let endPage = startPage + maxVisiblePages - 1;

			if (endPage > totalPages) {
				endPage = totalPages;
				startPage = Math.max(endPage - maxVisiblePages + 1, 1);
			}

			if (startPage > 1) {
				pageNumbers.push(1);
				if (startPage > 2) pageNumbers.push('...');
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - 1) pageNumbers.push('...');
				pageNumbers.push(totalPages);
			}
		}

		return pageNumbers;
	};

	return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dymOrange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Página anterior"
      >
        <img src={chevronDownIcon.toString()} className='rotate-90'/>
      </button>
      
      {getPageNumbers().map((number, index) => (
        <React.Fragment key={index}>
          {typeof number === 'number' ? (
            <button
              onClick={() => onPageChange(number)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${
                currentPage === number
                  ? 'bg-dymOrange text-dymAntiPop'
                  : 'hover:border hover:border-dymOrange'
              }`}
            >
              {number}
            </button>
          ) : (
            <span className="w-10 h-10 flex items-center justify-center">...</span>
          )}
        </React.Fragment>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dymOrange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Página siguiente"
      >
       <img src={chevronDownIcon.toString()} className='-rotate-90'/>
      </button>
    </div>
  );
};

export default Pagination;
