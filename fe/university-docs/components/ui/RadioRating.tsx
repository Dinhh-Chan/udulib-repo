import React from 'react';
import styled from 'styled-components';

interface RadioRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  loading?: boolean;
}

const RadioRating: React.FC<RadioRatingProps> = ({ value, onChange, disabled, loading }) => {
  return (
    <StyledWrapper>
      <div className="rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <React.Fragment key={star}>
            <input
              value={star}
              name="rate"
              id={`star${star}`}
              type="radio"
              checked={value === star}
              onChange={() => onChange(star)}
              disabled={disabled || loading}
            />
            <label title={`Đánh giá ${star} sao`} htmlFor={`star${star}`} />
          </React.Fragment>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .rating:not(:checked) > input {
    position: absolute;
    appearance: none;
  }

  .rating:not(:checked) > label {
    float: right;
    cursor: pointer;
    font-size: 30px;
    color: #666;
  }

  .rating:not(:checked) > label:before {
    content: '★';
  }

  .rating > input:checked + label:hover,
  .rating > input:checked + label:hover ~ label,
  .rating > input:checked ~ label:hover,
  .rating > input:checked ~ label:hover ~ label,
  .rating > label:hover ~ input:checked ~ label {
    color: #e58e09;
  }

  .rating:not(:checked) > label:hover,
  .rating:not(:checked) > label:hover ~ label {
    color: #ff9e0b;
  }

  .rating > input:checked ~ label {
    color: #ffa723;
  }
`;

export default RadioRating; 