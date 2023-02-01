# @windeco/product-preview

> This package improves customer experience with interactive 3D product models on Windeco's website. It features a React component for rendering 3D models, API repositories, and a materials preview component.

## Table of Contents

## Installation

```sh
$ npm i git@github.com:rabelium/windeco-product-preview.git -S
```

or

```sh
$ yarn add git@github.com:rabelium/windeco-product-preview.git
```

## Usage

### Repositories Usage

All repositories are typed so their request parameters and response types are protected with typescript typing.
In this example we use the material repository to get a material :

```jsx
import { MaterialsRepository, MaterialInterface } from '@windeco/product-preview'

  ...
  const [entity, setEntity] = useState<MaterialInterface>()

  useEffect(() => {
    MaterialsRepository.get(id).then(setEntity)
  }, [id])
  ...
```

#### Available Repositories:

- **MediaRepository**: Allows for images API handling
- **MaterialsRepository**: Allows for materials API handling
- **PreviewsRepository**: Allows for 3D models API handling

### Product Preview Usage

In this example we simply render a product by its ID:

```jsx
import { Material, MaterialInterface, MaterialsRepository } from '@windeco/product-preview'

const ProductPreview = ({ id }) => {
  const size = 512

  return (
    <Viewer
      id={id}
      width={size}
      height={size}
      hidden={['rings', 'rod']}
      showBehind={true}
      environment={false}
      materials={materials}
      skybox='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/hilly_terrain_01_1k.hdr'
    />
  )
}
```

#### Props

| Property    | Type                                              | Required | Default | Description                                                                                                            |
| ----------- | ------------------------------------------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| id          | string                                            | true     |         | The identifier of the products's 3D model. The 3D model's slug can be used too.                                        |
| width       | number                                            | false    | 512     | Width of the rendering panel                                                                                           |
| height      | number                                            | false    | 512     | Height of the rendering panel                                                                                          |
| skybox      | string                                            | false    |         | The URL of a HDR image to be rendered as a background.                                                                 |
| hidden      | string[]                                          | false    |         | A list of components that need to be hidden. To get the list of a 3D model components use `PreviewsRepository.get(id)` |
| materials   | Record\<string, [MaterialSetup](#MaterialSetup)\> | false    |         | A configuration object containing the materials settings to be applied.                                                |
| environment | boolean                                           | false    | false   | Display the product with its environment or by itself.                                                                 |
| showBehind  | boolean                                           | false    | false   | Allow the user to rotate the product to display it from behind or limit the possible rotation.                         |

### Material Preview Usage

In this example we use all material components and types this library supports to display a material's preview:

```jsx
import { Material, MaterialInterface, MaterialsRepository } from '@windeco/product-preview'

const MaterialPreview = ({id}) => {
  const [entity, setEntity] = useState<MaterialInterface>()

  useEffect(() => {
    MaterialsRepository.get(id).then(setEntity)
  }, [id])

  return <Material entity={entity} />
}
```

#### Props

| Property | Type                                               | Required | Default | Description                                                                                                           |
| -------- | -------------------------------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| entity   | MaterialInterface                                  | true     |         |
| fields   | Partial\<[MaterialInterface](#MaterialInterface)\> | false    |         | If you want to modify the material on runtime. This is helpful to preview the material's render during edit or create |

### Enums

#### MediumCategory

This enum lists the types of images:

```typescript
enum MediumCategory {
  Logos = 'logos',
  Tiles = 'tiles',
  Assets = 'assets',
  Render = 'renders',
  Avatars = 'avatars',
  Textures = 'textures',
  Components = 'components',
}
```

#### AlphaMode

This enum lists the types of alpha modes of a material:

```typescript
enum AlphaMode {
  Opaque = 'OPAQUE',
  Mask = 'MASK',
  Blend = 'BLEND',
}
```

### Interfaces

#### EntitiesList

This interface represents a list of an object of type T, this is used for lists:

```typescript
interface EntitiesList<T> {
  entities: T[]
  total: number
}
```

#### DeleteResponseInterface

This interface represents the response of a delete query:

```typescript
interface DeleteResponseInterface {
  acknowledged: boolean
  deletedCount: number
}
```

#### MediumInterface

This interface represents the response object of an image details:

```typescript
interface MediumInterface {
  id: string
  path: string
  mime_type: string
  label: string
  description: string
  file_size: number
  fitting: number
  is_used: boolean
  width: number
  height: number
  category: MediumCategory
  texture_usage: string
  uploaded_at: string
  created_at: string
  updated_at: string
}
```

#### MediumFormData

This interface represents the object to create or update an image:

```typescript
interface MediumFormData {
  media: File
  label?: string
  description?: string
  is_used?: boolean
  tenant?: string
  fitting?: number
  category: MediumCategory
}
```

#### MaterialInterface

This interface represents the response object of a material object:

```typescript
interface MaterialInterface {
  id?: string
  label: string
  is_cloth: boolean
  metalness: number
  roughness: number
  scale?: number
  rotation?: number
  sheen?: number
  color?: string
  sheen_color?: string
  specular_color?: string
  opacity: number
  alpha_mode: AlphaMode
  diffuse_texture?: string
  metallic_roughness_texture?: string
  normal_texture?: string
  occlusion_texture?: string
  emission_texture?: string
  sheen_texture?: string
  specular_texture?: string
}
```

#### MaterialFormData

This interface represents the object to create or update a material:

```typescript
interface MaterialFormData {
  label: string
  is_cloth: boolean
  metalness?: number
  roughness?: number
  sheen?: number
  sheen_color?: string
  specular_color?: string
  color?: number
  opacity?: number
  alpha_mode?: AlphaMode
  scale?: number
  rotation?: number
  diffuse_texture?: File
  metallic_roughness_texture?: File
  normal_texture?: File
  occlusion_texture?: File
  emission_texture?: File
  sheen_texture?: File
  specular_texture?: File
}
```

#### MaterialSetup

This interface represents the object to configure the materials of a 3D model:

```typescript
interface MaterialSetup {
  material?: string
  color?: string
  background?: string
  tile?: string
}
```

#### PreviewInterface

This interface represents the response object of a 3d model details:

```typescript
interface PreviewInterface {
  id: string
  meshes: string[]
  configuration: {
    environment: string[]
    default_hide: string[]
    env_parts: string[]
    material_setup: MaterialType[]
  }
  created_at: string
  updated_at: string
}
```

#### PreviewFormData

This interface represents the object to create or update a 3D model:

```typescript
interface PreviewFormData {
  label: string
  is_environment: boolean
  binary: File
  preview: File
  images: File[]
  environment: string
  kept_materials: string
  fixed_materials: string
  materials: Record<string, MaterialType>
  env_parts: string
  default_hide: string
}
```
