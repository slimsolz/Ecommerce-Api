/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const Category = sequelize.define('Category', {
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'category_id'
		},
		departmentId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'department_id'
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name'
		},
		description: {
			type: DataTypes.STRING(1000),
			allowNull: true,
			field: 'description'
		}
	}, {
		tableName: 'category'
	});

	Category.associate = (models) => {
    Category.belongsToMany(models.Product, {
      through: 'ProductCategory',
      foreignKey: 'categoryId'
    });
	};

	return Category;
};
