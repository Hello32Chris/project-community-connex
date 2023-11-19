"""empty message

Revision ID: 5d28358b0eea
Revises: 3d01abaf6f67
Create Date: 2023-11-18 23:45:17.529139

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5d28358b0eea'
down_revision = '3d01abaf6f67'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('goods_services', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('goods_services', schema=None) as batch_op:
        batch_op.drop_column('image')

    # ### end Alembic commands ###
