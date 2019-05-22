/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Customer = sequelize.define('Customer', {
		customerId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'customer_id',
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'name'
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			field: 'email'
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'password'
		},
		creditCard: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'credit_card'
		},
		address1: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'address_1'
		},
		address2: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'address_2'
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'city'
		},
		region: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'region'
		},
		postalCode: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'postal_code'
		},
		country: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'country'
		},
		shippingRegionId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1',
			field: 'shipping_region_id'
		},
		dayPhone: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'day_phone'
		},
		evePhone: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'eve_phone'
		},
		mobPhone: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'mob_phone'
		}
	}, {
		tableName: 'customer'
	});

	return Customer;
};
