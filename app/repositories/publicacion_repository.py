from .base_repository import Repository
from entities.publicacion import Publicacion

class PublicacionRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Publicacion, "Cli_Publicaciones")

    def create_post(self, post_data, media_list):
        cursor = self.conn.cursor()
        try:
            # Create Post
            keys = ", ".join(post_data.keys())
            placeholders = ", ".join(["%s"] * len(post_data))
            sql = f"INSERT INTO {self.table_name} ({keys}) VALUES ({placeholders})"
            cursor.execute(sql, tuple(post_data.values()))

            # Create Media
            for media in media_list:
                m_keys = ", ".join(media.keys())
                m_placeholders = ", ".join(["%s"] * len(media))
                m_sql = f"INSERT INTO Cli_Publicacion_Media ({m_keys}) VALUES ({m_placeholders})"
                cursor.execute(m_sql, tuple(media.values()))
            
            self.conn.commit()
            return True
        except Exception as e:
            self.conn.rollback()
            print(f"Error creating publication: {e}")
            return False
        finally:
            cursor.close()

    def get_feed(self, limit=20, offset=0):
        cursor = self.conn.cursor(dictionary=True)
        # Get posts with user info
        sql = """
            SELECT p.*, c.NombreUsuario as Autor, c.IdPersona
            FROM Cli_Publicaciones p
            JOIN Seg_Cliente c ON p.IdCliente = c.Id
            WHERE p.ESTADO = 1
            ORDER BY p.FechaPublicacion DESC
            LIMIT %s OFFSET %s
        """
        cursor.execute(sql, (limit, offset))
        posts = cursor.fetchall()
        
        # Determine unique post IDs to fetch media efficiently
        if not posts:
            cursor.close()
            return []
            
        post_ids = [p['Id'] for p in posts]
        format_strings = ','.join(['%s'] * len(post_ids))
        
        # Fetch media for these posts
        media_sql = f"SELECT * FROM Cli_Publicacion_Media WHERE IdPublicacion IN ({format_strings}) AND ESTADO = 1"
        cursor.execute(media_sql, tuple(post_ids))
        all_media = cursor.fetchall()
        
        cursor.close()
        
        # Attach media to posts
        posts_map = {p['Id']: {**p, 'Media': []} for p in posts}
        for m in all_media:
            if m['IdPublicacion'] in posts_map:
                posts_map[m['IdPublicacion']]['Media'].append(m)
                
        return list(posts_map.values())
