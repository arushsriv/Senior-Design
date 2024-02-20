import pandas as pd  # Ensure you have this import at the beginning of your script

class Card:
    def __init__(self, card):
        self.card = card

    def get_top_cards(
        self,
        debt_to_income_ratio,
        average_total_monthly_balance,
        new_cards,
        annual_fee_preference,
        bonus_weight,
        fico_score,
        annual_fee_limit=None
    ):
        credit_cards_data = pd.DataFrame(self.card)
        try:
            if not (0 <= bonus_weight <= 1):
                print("Input is not between 0 and 1.")
                return  # Return or handle the invalid input
        except ValueError:
            print("Input is not a valid float number.")
            return  # Return or handle the invalid input

        if annual_fee_preference and annual_fee_limit is None:
            print("Annual fee limit is required when annual fee preference is selected.")
            return  # You may want to return or handle this situation

        if debt_to_income_ratio > 0.5:
            print("\n Due to your high debt-to-income ratio, we recommend focusing on your budgeting before getting a new card.")
            print("\n Check out the budgeting tab of our website for more budgeting tips.  ")
            return  # You may want to return or handle this situation

        if new_cards > 4:
            print("\n According to the Chase 5/24 Rule, you shouldn't create more than 5 new credit card accounts within 24 months. ")
            print("\n Consider waiting a couple of months before applying for your next card to avoid hurting your credit score. ")
            return  # You may want to return or handle this situation

        credit_cards_data["card_month_avg"] = credit_cards_data['offerSpend'] / credit_cards_data['offerDays']

        # Filter credit cards based on user preferences
        filtered_cards = credit_cards_data[
            (credit_cards_data['annualFee'] <= annual_fee_limit if annual_fee_preference else credit_cards_data['annualFee']) &  # Cards within annual fee limit
            (credit_cards_data["card_month_avg"] < average_total_monthly_balance) &
            (credit_cards_data['score_min'] < fico_score) &
            (credit_cards_data['isBusiness'] != 'TRUE')  # Exclude business cards
        ]

        add_vals = credit_cards_data.loc[credit_cards_data['offerSpend'] == 0]
        filtered_cards = pd.concat([add_vals, filtered_cards])

        # Sort cards based on a scoring mechanism (custom logic based on user preferences)
        filtered_cards['score'] = (
                filtered_cards['offerAmount'] * bonus_weight +  # Adjust weights based on importance
                filtered_cards['universalCashbackPercent'] * (1 - bonus_weight)
        )

        # Get top 3 cards
        top_cards = filtered_cards.sort_values(by='score', ascending=False).head(3)

        # Return the top 3 ideal credit cards
        return top_cards[['name', 'issuer', 'offerAmount', 'offerSpend', 'offerDays', 'universalCashbackPercent', 'annualFee', 'url', 'imageUrl']]

    # Example usage
    top_cards_result = get_top_cards(
        debt_to_income_ratio=0.4,
        average_total_monthly_balance=3000,
        new_cards=2,
        annual_fee_preference=True,
        bonus_weight=0.8,
        fico_score=750,
        annual_fee_limit=100
    )

    print("\nTop 3 Ideal Credit Cards:")
    print(top_cards_result)
