// Copyright 2017-2019, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const OneSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringScreenView' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {EnergyModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringScreenView.call( this, model, tandem, {
      dampingVisible: true
    } );
    const self = this;

    // Contains visibility options for the reference lines and displacement arrow
    const indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

    // VBox that contains all of the panel's content
    const optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    const rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing * 0.9 } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();


    this.visibleBoundsProperty.link( function() {
      rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.energyGraphNode.top );
    } );

    this.shelf.rectWidth = 140;
    this.shelf.left = this.energyGraphNode.right + this.spacing;

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();
  }

  massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( OneSpringScreenView, EnergyScreenView );
} );