// Copyright 2016-2021, University of Colorado Boulder

/**
 * Common screen view for vectors screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { VBox } from '../../../../scenery/js/imports.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import ReferenceLineNode from '../../common/view/ReferenceLineNode.js';
import TwoSpringScreenView from '../../common/view/TwoSpringScreenView.js';
import massesAndSprings from '../../massesAndSprings.js';
import DisplacementArrowNode from './DisplacementArrowNode.js';
import VectorVisibilityControlNode from './VectorVisibilityControlNode.js';

class VectorsScreenView extends TwoSpringScreenView {

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem );
    // Displacement arrows added for each springs
    const firstDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].nodeProperty.value.spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        left: this.springNodes[ 0 ].nodeProperty.value.right + 8,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].nodeProperty.value.spring.bottomProperty.value )
      } );
    this.addChild( firstDisplacementArrowNode );

    const secondDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 1 ].nodeProperty.value.spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        right: this.springNodes[ 1 ].nodeProperty.value.left + 14,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 1 ].nodeProperty.value.spring.bottomProperty.value )
      } );
    this.addChild( secondDisplacementArrowNode );

    // Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    const firstMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      ( equilibriumPositionVisible, massAttached ) => !!massAttached && equilibriumPositionVisible );
    const secondMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.secondSpring.massAttachedProperty ],
      ( equilibriumPositionVisible, massAttached ) => !!massAttached && equilibriumPositionVisible );

    // Initializes equilibrium line for first spring
    const firstMassEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.massEquilibriumYPositionProperty,
      firstMassEquilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Initializes equilibrium line for second spring
    const secondMassEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.massEquilibriumYPositionProperty,
      secondMassEquilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Adding system controls to scene graph
    this.addChild( this.springSystemControlsNode );

    // Reference lines from indicator visibility box
    this.addChild( this.firstNaturalLengthLineNode );
    this.addChild( this.secondNaturalLengthLineNode );
    this.addChild( firstMassEquilibriumLineNode );
    this.addChild( secondMassEquilibriumLineNode );
    this.addChild( this.movableLineNode );
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    // Contains visibility options for the reference lines and displacement arrow
    const indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

    // Contains all of the display options for the vectors and forces
    const vectorVisibilityControlNode = new VectorVisibilityControlNode(
      model,
      tandem.createTandem( 'vectorVisibilityControlNode' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 30
      } );

    // VBox that contains all of the panel's content
    const optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        vectorVisibilityControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    const rightPanelsVBox = new VBox( { children: [ optionsPanel, this.toolboxPanel ], spacing: this.spacing * 0.9 } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();

    this.visibleBoundsProperty.link( () => {
      rightPanelsVBox.rightTop = new Vector2( this.panelRightSpacing, this.springSystemControlsNode.top );
    } );
  }
}

massesAndSprings.register( 'VectorsScreenView', VectorsScreenView );
export default VectorsScreenView;